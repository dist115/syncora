import { db } from '@/db';

import 'server-only';

import { tagsPivot as TagsPivotTable, tags as TagsTable } from '@/db/schema';
import { and, desc, eq, ilike } from 'drizzle-orm';
import slugify from 'slugify';

import { type TagOwnerType } from '@/config/tags';
import { TagInput } from '@/lib/validations/tag.schema';

export const TagsService = {
  getTags: ({ search, ownerId }: { search: string; ownerId: string }) => {
    return db.query.tags.findMany({
      where: and(
        ilike(TagsTable.label, `%${search}%`),
        eq(TagsTable.ownerId, ownerId)
      ),
      orderBy: desc(TagsTable.createdAt),
    });
  },

  getBySlug: async (slug: string) => {
    return await db.query.tags.findFirst({
      where: eq(TagsTable.slug, slug),
    });
  },

  create: async (
    input: TagInput & {
      ownerId: string;
      ownerType: TagOwnerType;
    }
  ) => {
    const { label, ownerId, ownerType } = input;
    let slug = slugify(label, { lower: true, trim: true });
    const existing = await db.query.tags.findFirst({
      where: and(
        eq(TagsTable.slug, slug),
        eq(TagsTable.ownerId, ownerId),
        eq(TagsTable.ownerType, ownerType)
      ),
    });
    if (existing) {
      return existing;
    }
    const [inserted] = await db
      .insert(TagsTable)
      .values({
        label,
        slug,
        ownerId,
        ownerType,
      })
      .onConflictDoNothing()
      .returning();
    return inserted;
  },

  edit: async (id: string, input: TagInput) => {
    const { label } = input;
    let slug = slugify(label, { lower: true, trim: true });
    const [updated] = await db
      .update(TagsTable)
      .set({
        label,
        slug,
      })
      .where(eq(TagsTable.id, id))
      .returning();
    return updated;
  },

  delete: async (id: string) => {
    await db.delete(TagsPivotTable).where(eq(TagsPivotTable.tagId, id));
    const [deleted] = await db
      .delete(TagsTable)
      .where(eq(TagsTable.id, id))
      .returning();
    return deleted;
  },

  detachAllTags: async (taggableId: string) => {
    await db
      .delete(TagsPivotTable)
      .where(eq(TagsPivotTable.taggableId, taggableId));
  },

  attachTags: async (
    values: {
      tagId: string;
      taggableId: string;
      tagType: any;
    }[]
  ) => {
    return db
      .insert(TagsPivotTable)
      .values(values)
      .onConflictDoNothing()
      .returning();
  },
};
