import 'server-only';

import { db } from '@/db';
import {
  CommentType,
  File,
  files,
  files as filesModel,
  NewFile,
  tags,
  TagType,
  team as teamModel,
  users,
} from '@/db/schema';
import { comments } from '@/db/schema/comments';
import { tagsPivot } from '@/db/schema/tags-pivot';
import { createId } from '@paralleldrive/cuid2';
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  ilike,
  isNull,
  not,
  sql,
  count as sqlCount,
  SQLWrapper,
} from 'drizzle-orm';

import { FileSortType, SortOrderType } from '@/config/sorting';
import {
  distinctOn,
  inJsonArray,
  jsonAggBuildObject,
} from '@/lib/utils/query-helpers';

type FilePromise = Promise<File | undefined>;

export enum FolderSizeUpdateType {
  increase = 1,
  decrease = 0,
}

export const FilesService = {
  uploadFile: async (data: NewFile[]) => {
    data.forEach(async (data: NewFile) => {
      const parent = data.parentId || '';
      const size = data.fileSize || 0;
      await FilesService.updateFolderSize(parent, size);
    });

    return await db.insert(filesModel).values(data).returning();
  },

  getFiles: async (
    params: {
      size?: number;
      page?: number;
      search?: string;
      sort?: FileSortType;
      order?: SortOrderType;
      tag?: string;
      type?: string;
      team?: string;
      isFavourite?: boolean;
    },
    options: {
      userId?: string;
      teamId?: string | null;
      allFiles?: boolean;
      excludeByType?: string;
    }
  ): Promise<{ files: File[]; count: number }> => {
    const size = Number(params.size);
    const page = params.page ? Number(params.page) - 1 : 0;
    const search = params.search || '';
    const tag = params.tag || '';
    const sort = params.sort || 'updatedAt';
    const order = params.order || 'desc';
    const type = params.type || '';
    const team = params.team || '';
    const excludeType = options.excludeByType || '';
    const isFavourite = params.isFavourite || false;

    const conditions: SQLWrapper[] = [];
    if (options?.teamId) {
      conditions.push(eq(filesModel.teamId, options.teamId));
    } else {
      conditions.push(isNull(filesModel.teamId));
      if (options?.userId) {
        conditions.push(eq(filesModel.userId, options.userId));
      }
    }
    if (excludeType) {
      conditions.push(not(eq(filesModel.type, excludeType)));
    }
    if (isFavourite) {
      conditions.push(eq(filesModel.isFavourite, isFavourite));
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

    const { files, count }: { files: File[]; count: number } =
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
        return {
          files,
          count,
        };
      });

    return {
      files,
      count,
    };
  },

  getFileById: async (id: string) => {
    return await db.query.files.findFirst({
      where: eq(filesModel.id, id),
      with: {
        comments: {
          where: eq(comments.commentType, CommentType.files),
          with: {
            commenter: true,
          },
        },
        tags: {
          where: eq(tagsPivot.tagType, TagType.files),
          with: {
            tag: true,
          },
        },
      },
    });
  },
  getFileByType: async (type: string) => {
    return await db.query.files.findFirst({
      where: eq(filesModel.type, type),
      with: {
        comments: {
          where: eq(comments.commentType, CommentType.files),
          with: {
            commenter: true,
          },
        },
        tags: {
          where: eq(tagsPivot.tagType, TagType.files),
          with: {
            tag: true,
          },
        },
      },
    });
  },

  getTrashFiles: async (
    params: {
      size?: number;
      page?: number;
    },
    userId?: string,
    teamId?: string | null
  ): Promise<{ files: File[]; count: number }> => {
    const size = Number(params.size) || 10;
    const page = params.page ? Number(params.page) - 1 : 0;

    const team = teamId as string;

    const conditions: SQLWrapper[] = [];
    conditions.push(
      sql`trashed = TRUE AND(parent_id IS NULL OR parent_id NOT IN (SELECT id FROM files WHERE trashed = TRUE))`
    );

    if (team) {
      conditions.push(eq(filesModel.teamId, team));
    } else {
      conditions.push(
        eq(filesModel.userId, userId as string),
        isNull(filesModel.teamId)
      );
    }

    const where = and(eq(filesModel.trashed, true), ...conditions);

    const { files, count }: { files: File[]; count: number } =
      await db.transaction(async (db): Promise<any> => {
        const files = await db
          .select()
          .from(filesModel)
          .where(where)
          .offset(page * size)
          .limit(size)
          .orderBy(desc(filesModel.updatedAt));

        const result = await db
          .select({ count: sql<number>`count(*)` })
          .from(filesModel)
          .where(where);
        const count = result[0].count;

        return { files, count };
      });

    return { files, count };
  },

  getFavouriteFiles: async (
    params: {
      size?: number;
      page?: number;
      search?: string;
      sort?: FileSortType;
      order?: SortOrderType;
      type?: string;
      tag?: string;
    },
    userId?: string,
    teamId?: string | null
  ): Promise<{ files: File[]; count: number }> => {
    const size = Number(params.size) || 10;
    const page = params.page ? Number(params.page) - 1 : 0;
    const search = params.search || '';
    const sort = params.sort || 'name';
    const order = params.order || 'asc';
    const type = params.type || '';
    const tag = params.tag || '';

    const team = teamId as string;
    const user = userId as string;

    const conditions: SQLWrapper[] = [];
    conditions.push(
      sql`is_favourite = TRUE AND (parent_id IS NULL OR parent_id NOT IN (SELECT id FROM files WHERE is_favourite = TRUE))`
    );

    if (team) {
      conditions.push(eq(filesModel.teamId, team));
    } else {
      conditions.push(eq(filesModel.userId, user), isNull(filesModel.teamId));
    }
    if (search) {
      conditions.push(ilike(filesModel.name, `%${search.toLowerCase()}%`));
    }

    if (type) {
      conditions.push(eq(filesModel.type, type));
    }
    const sortBy =
      sort === 'name'
        ? filesModel.name
        : sort === 'size'
          ? filesModel.fileSize
          : filesModel.updatedAt;

    const orderBy = order === 'asc' ? asc(sortBy) : desc(sortBy);

    const { files, count }: { files: File[]; count: number } =
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
        const where = and(eq(filesModel.isFavourite, true), ...conditions);
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
          .offset(page * size)
          .limit(size)
          .orderBy(orderBy);

        const [fileCount] = await db
          .select({ count: sqlCount() })
          .from(filesModel)
          .leftJoin(tagsQuery, eq(tagsQuery.taggableId, filesModel.id))
          .where(where);
        const count = fileCount.count;
        return {
          files,
          count,
        };
      });

    return { files, count };
  },

  getFileByHash: async (hash: string): FilePromise => {
    return await db.query.files.findFirst({
      where: eq(filesModel.hash, hash),
    });
  },

  shareFile: async (id: string): FilePromise => {
    const [file] = await db
      .update(filesModel)
      .set({ isPublic: true, hash: createId() })
      .where(eq(filesModel.id, id))
      .returning();

    return file;
  },

  makePrivate: async (id: string): FilePromise => {
    const [file] = await db
      .update(filesModel)
      .set({ isPublic: false, hash: null })
      .where(eq(filesModel.id, id))
      .returning();

    return file;
  },

  makeFavourite: async (id: string, flag: boolean): FilePromise => {
    const [file] = await db
      .update(filesModel)
      .set({ isFavourite: flag, hash: null })
      .where(eq(filesModel.id, id))
      .returning();

    return file;
  },

  updateFolderSize: async (
    parentId: string | null = '',
    fileSize: number = 0,
    folderUpdateType: FolderSizeUpdateType = FolderSizeUpdateType.increase
  ) => {
    if (!parentId) return;
    const sizeChange =
      folderUpdateType === FolderSizeUpdateType.increase ? fileSize : -fileSize;
    const updateQuery = folderUpdateType
      ? sql`
      UPDATE files 
      SET file_size = file_size + ${fileSize} 
      WHERE id = ${parentId}
    `
      : sql`
      UPDATE files 
      SET file_size = 
          CASE 
              WHEN file_size + ${sizeChange} < 0 THEN 0 
              ELSE file_size + ${sizeChange} 
          END
      WHERE id = ${parentId}
    `;
    await db.execute(updateQuery);

    const folders = await db
      .select()
      .from(filesModel)
      .where(eq(filesModel.id, parentId));

    const parent = folders[0];
    if (parent && parent.parentId) {
      await FilesService.updateFolderSize(
        parent.parentId,
        fileSize,
        folderUpdateType
      );
    }
  },

  delete: async (id: string): FilePromise => {
    const file = await db.query.files.findFirst({
      where: (files) => eq(files.id, id),
    });

    if (!file) return;

    const [deleted] = await db
      .delete(filesModel)
      .where(eq(filesModel.id, id))
      .returning();

    FilesService.updateFolderSize(
      file.parentId,
      file.fileSize || 0,
      FolderSizeUpdateType.decrease
    );

    return deleted;
  },

  bulkFilesDelete: async (ids: string[]) => {
    const deletedFiles = await db
      .delete(files)
      .where(sql`id IN (${sql.join(ids, sql`, `)})`)
      .returning();

    deletedFiles.forEach((item: any) =>
      FilesService.updateFolderSize(
        item.parentId as string,
        item.fileSize as number,
        FolderSizeUpdateType.decrease
      )
    );

    return deletedFiles;
  },
  emptyTrash: async (ids: string[]) => {
    const deleteItems = await db
      .delete(files)
      .where(sql`id IN (${sql.join(ids, sql`, `)})`)
      .returning();

    deleteItems.forEach((item: any) =>
      FilesService.updateFolderSize(
        item.parentId as string,
        item.fileSize as number,
        FolderSizeUpdateType.decrease
      )
    );

    return deleteItems;
  },
};
