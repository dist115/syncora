import 'server-only';

import { db } from '@/db';
import {
  File,
  files as filesModel,
  Folder,
  NewFile,
  tags,
  tagsPivot,
  team as teamModel,
  users,
} from '@/db/schema';
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  isNull,
  sql,
  count as sqlCount,
  SQLWrapper,
} from 'drizzle-orm';

import { MESSAGES } from '@/config/messages';
import { FileSortType, SortOrderType } from '@/config/sorting';
import {
  distinctOn,
  inJsonArray,
  jsonAggBuildObject,
} from '@/lib/utils/query-helpers';
import { deleteMultipleFiles } from '@/lib/utils/s3/delete';

import { FilesService, FolderSizeUpdateType } from './files.service';

type FilePromise = Promise<File | undefined>;

export const FoldersService = {
  getAll: async (
    userId: string,
    teamId?: string | null,
    options?: { excludeByParent?: boolean }
  ): Promise<Folder[]> => {
    let where: any;
    const excludeByParent = options?.excludeByParent || false;
    if (typeof teamId === 'undefined' || teamId === null) {
      where = and(
        eq(filesModel.type, 'folder'),
        eq(filesModel.userId, userId),
        isNull(filesModel.teamId),
        isNull(filesModel.trashed)
      );
    } else {
      where = and(
        eq(filesModel.type, 'folder'),
        eq(filesModel.teamId, teamId),
        isNull(filesModel.trashed)
      );
    }
    if (excludeByParent) {
      where = and(
        eq(filesModel.type, 'folder'),
        eq(filesModel.userId, userId),
        isNull(filesModel.teamId),
        isNull(filesModel.trashed),
        isNull(filesModel.parentId)
      );
    }
    return await db.query.files.findMany({
      where,
      orderBy: [asc(filesModel.name)],
    });
  },

  getFolders: async (
    params: {
      size?: number;
      page?: number;
      search?: string;
      sort?: FileSortType;
      order?: SortOrderType;
      tag?: string;
      type?: string;
      team?: string;
    },
    options?: {
      userId?: string;
      teamId?: string | null;
      parentId?: string | null;
      allFiles?: boolean;
    }
  ): Promise<{ files: File[]; count: number; breadcrumbs: any }> => {
    const size = Number(params.size) || 10;
    const page = params.page ? Number(params.page) - 1 : 0;
    const search = params.search || '';
    const tag = params.tag?.toLowerCase() || '';
    const sort = params.sort || 'name';
    const order = params.order || 'asc';
    const type = params.type || '';
    const team = params.team || '';

    const conditions: SQLWrapper[] = [];
    if (!options?.allFiles) {
      if (options?.teamId) {
        conditions.push(eq(filesModel.teamId, options.teamId));
      } else {
        conditions.push(isNull(filesModel.teamId));
        if (options?.userId) {
          conditions.push(eq(filesModel.userId, options.userId));
        }
      }
    }

    // Additional condition to filter by the specific teamId
    if (options?.teamId) {
      conditions.push(eq(filesModel.teamId, options.teamId));
    }

    if (search) {
      conditions.push(ilike(filesModel.name, `%${search.toLowerCase()}%`));
    }

    if (type) {
      conditions.push(eq(filesModel.type, type));
    }

    if (team) {
      conditions.push(eq(filesModel.teamId, team));
    }
    if (options?.parentId) {
      conditions.push(eq(filesModel.parentId, options.parentId));
    }

    const {
      files,
      count,
      breadcrumbs,
    }: { files: File[]; count: number; breadcrumbs: any } =
      await db.transaction(async (db): Promise<any> => {
        const tagQuery = db
          .select({
            id: distinctOn(tagsPivot.id).mapWith(String).as('tags_pivot_id'),
            tagId: sql`${tagsPivot.tagId}`.mapWith(String).as('tag_id'),
            taggableId: sql`${tagsPivot.taggableId}`
              .mapWith(String)
              .as('tagged_file_id'),
            label: tags.label,
            slug: tags.slug,
          })
          .from(tagsPivot)
          .innerJoin(tags, eq(tags.id, tagsPivot.tagId))
          .orderBy(tagsPivot.id)
          .as('tag_query');

        const tagsQuery = db
          .select({
            taggableId: tagQuery.taggableId,
            tags: jsonAggBuildObject({
              id: tagQuery.tagId,
              label: tagQuery.label,
              slug: tagQuery.slug,
            }).as('tags'),
          })
          .from(tagQuery)
          .groupBy(tagQuery.taggableId)
          .as('tags_query');

        if (tag) {
          conditions.push(inJsonArray(tagsQuery.tags, 'slug', tag));
        }

        if (!options?.allFiles) {
          conditions.push(isNull(filesModel.parentId));
        }

        const where = and(isNull(filesModel.trashed), ...conditions);

        const sortBy =
          sort === 'name'
            ? filesModel.name
            : sort === 'size'
              ? filesModel.fileSize
              : filesModel.updatedAt;

        const orderBy = order === 'asc' ? asc(sortBy) : desc(sortBy);
        const files = await db
          .select({
            ...getTableColumns(filesModel),
            tags: tagsQuery.tags,
            user: { name: users.name },
            team: { name: teamModel.name },
          })
          .from(filesModel)
          .leftJoin(tagsQuery, eq(tagsQuery.taggableId, filesModel.id))
          .leftJoin(users, eq(filesModel.userId, users.id))
          .leftJoin(teamModel, eq(teamModel.id, filesModel.teamId))
          .where(where)
          .orderBy(orderBy)
          .limit(size)
          .offset(page * size);

        const [fileCount] = await db
          .select({ count: sqlCount() })
          .from(filesModel)
          .leftJoin(tagsQuery, eq(tagsQuery.taggableId, filesModel.id))
          .where(where);
        const count = fileCount.count;

        const raw = await db.execute(
          sql`WITH RECURSIVE DirectoryPath AS (
              SELECT id, name, parent_id, type
              FROM files
              WHERE id = ${options?.parentId}
              UNION ALL
              SELECT f.id, f.name, f.parent_id, f.type
              FROM files AS f
              JOIN DirectoryPath AS dp ON dp.parent_id = f.id
            )
            SELECT id, name, type
            FROM DirectoryPath`
        );

        const breadcrumbs = raw.rows.reverse();
        return {
          files,
          count,
          breadcrumbs,
        };
      });

    return {
      files,
      count,
      breadcrumbs,
    };
  },

  find: async (id: string): FilePromise => {
    return await db.query.files.findFirst({
      where: (files, { eq }) => eq(files.id, id),
    });
  },

  create: async (data: NewFile) => {
    return await db.insert(filesModel).values(data).returning();
  },

  isFolderExists: async ({
    name,
    fileName,
    userId,
    teamId,
    parentId,
  }: {
    name: string;
    fileName: string;
    userId: string;
    teamId?: string;
    parentId?: string;
  }) => {
    const team = teamId as string;
    const parent = parentId as string;

    const conditions: SQLWrapper[] = [];
    if (team) {
      conditions.push(eq(filesModel.teamId, team));
    }
    if (parent) {
      conditions.push(eq(filesModel.parentId, parent));
    }

    const where = and(
      eq(filesModel.name, name),
      eq(filesModel.fileName, fileName),
      eq(filesModel.userId, userId),
      eq(filesModel.type, 'folder'),
      isNull(filesModel.trashed),
      ...conditions
    );

    const isFolderExists = await db.query.files.findFirst({
      where,
    });
    if (isFolderExists) {
      throw new Error(MESSAGES.FOLDER_NAME_ALREADY_EXISTS);
    }
    return true;
  },

  delete: async (deleteId: string): FilePromise => {
    const query = await db.execute(
      sql`WITH RECURSIVE folder_hierarchy AS (
        SELECT
            id,
            type,
            file_name,
            parent_id,
            file_size
        FROM
            files
        WHERE
            id = ${deleteId}
        UNION ALL
        SELECT
            f.id,
            f.type,
            f.file_name,
            f.parent_id,
            f.file_size
        FROM
            files f
        INNER JOIN
            folder_hierarchy fh ON f.parent_id = fh.id
    )
    SELECT
        id,
        type,
        file_name,
        parent_id,
        file_size
    FROM
        folder_hierarchy`
    );

    const folders = query.rows;
    const deleteItems = folders.filter((row) => row.id !== deleteId);
    const deleteIds = deleteItems.map((item: any) => item.id);

    const fileNames = folders
      .filter((entry) => entry.type !== 'folder')
      .map((entry) => entry.file_name);

    // Recursive delete
    if (deleteIds.length > 0) {
      await db
        .delete(filesModel)
        .where(inArray(filesModel.id, deleteIds))
        .returning();

      // decrease folder size
      deleteItems.forEach((item) =>
        FilesService.updateFolderSize(
          item.parent_id as string,
          item.file_size as number,
          FolderSizeUpdateType.decrease
        )
      );
    }
    // Main delete
    const mainFile = folders.find((item) => item.id === deleteId);
    const [deleted] = await db
      .delete(filesModel)
      .where(eq(filesModel.id, deleteId))
      .returning();

    // decrease folder size
    mainFile?.parent_id &&
      FilesService.updateFolderSize(
        mainFile.parent_id as string,
        mainFile.file_size as number,
        FolderSizeUpdateType.decrease
      );

    // delete from s3
    if (fileNames.length > 0) {
      await deleteMultipleFiles(fileNames as []);
    }
    return deleted;
  },

  restore: async (id: string): FilePromise => {
    const query = await db.execute(
      sql`WITH RECURSIVE folder_hierarchy AS (
        SELECT
          id,
          type,
          file_name
        FROM
          files
        WHERE
          id = ${id}
        UNION ALL
        SELECT
          f.id,
          f.type,
          f.file_name
        FROM
          files f
        INNER JOIN
          folder_hierarchy fh ON f.parent_id = fh.id
        )
      SELECT
        id,
        type,
        file_name
      FROM
        folder_hierarchy`
    );

    const [restore] = await db
      .update(filesModel)
      .set({
        trashed: null,
        deletedAt: null,
      })
      .where(
        inArray(
          filesModel.id,
          query.rows.map((item: any) => item.id)
        )
      )
      .returning();

    return restore;
  },

  trash: async (id: string): FilePromise => {
    const query = await db.execute(
      sql`WITH RECURSIVE folder_hierarchy AS (
        SELECT
          id,
          type,
          file_name
        FROM
          files
        WHERE
          id = ${id}
        UNION ALL
        SELECT
          f.id,
          f.type,
          f.file_name
        FROM
          files f
        INNER JOIN
          folder_hierarchy fh ON f.parent_id = fh.id
        )
      SELECT
        id,
        type,
        file_name
      FROM
        folder_hierarchy`
    );

    const [updated] = await db
      .update(filesModel)
      .set({
        trashed: true,
        deletedAt: new Date(),
      })
      .where(
        inArray(
          filesModel.id,
          query.rows.map((item: any) => item.id)
        )
      )
      .returning();

    return updated;
  },

  trashMultiple: async (ids: string[]): Promise<FilePromise[]> => {
    const updatedFiles: FilePromise[] = [];

    for (const id of ids) {
      const [updated] = await db
        .update(filesModel)
        .set({ trashed: true, deletedAt: new Date() })
        .where(eq(filesModel.id, id))
        .returning();

      updatedFiles.push(updated as any);
    }

    return updatedFiles;
  },

  emptyTrash: async (): Promise<void> => {
    const deleteItems = await db
      .delete(filesModel)
      .where(eq(filesModel.trashed, true))
      .returning();

    deleteItems.forEach((item: any) =>
      FilesService.updateFolderSize(
        item.parentId as string,
        item.fileSize as number,
        FolderSizeUpdateType.decrease
      )
    );
  },

  update: async (id: string, data: Partial<NewFile>): FilePromise => {
    const updatedData = {
      ...data,
      updatedAt: new Date(), // Set updatedAt to the current timestamp
    };
    const [updated] = await db
      .update(filesModel)
      .set(updatedData)
      .where(eq(filesModel.id, id))
      .returning();

    return updated;
  },

  moveFolder: async (
    id: string,
    folderID: string | null,
    moveFromFolderID: string | null,
    fileSize: number | null
  ): Promise<File[]> => {
    const moveFolder = await db
      .update(filesModel)
      .set({ parentId: folderID })
      .where(eq(filesModel.id, id))
      .returning();

    if (moveFromFolderID !== folderID) {
      await FilesService.updateFolderSize(
        folderID,
        fileSize as number,
        FolderSizeUpdateType.increase
      );
      await FilesService.updateFolderSize(
        moveFromFolderID,
        fileSize as number,
        FolderSizeUpdateType.decrease
      );
    } else {
      await FilesService.updateFolderSize(
        moveFromFolderID,
        fileSize as number,
        FolderSizeUpdateType.decrease
      );
    }
    return moveFolder;
  },
};
