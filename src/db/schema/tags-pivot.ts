import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, unique, varchar } from 'drizzle-orm/pg-core';

import { tagTypeEnum } from './enums';
import { files } from './files';
import { tags } from './tags';

export const tagsPivot = pgTable(
  'tags_pivot',
  {
    id: varchar('id', { length: 255 }).$defaultFn(() => createId()),
    tagId: varchar('tag_id', { length: 255 })
      .references(() => tags.id)
      .notNull(),
    taggableId: varchar('taggable_id', { length: 255 }).notNull(),
    tagType: tagTypeEnum('tag_type').notNull(),
  },
  (t) => ({
    cpk: primaryKey({ columns: [t.tagId, t.taggableId] }),
  })
);

export const tagsPivotRelations = relations(tagsPivot, ({ one }) => ({
  file: one(files, {
    fields: [tagsPivot.taggableId],
    references: [files.id],
  }),
  tag: one(tags, {
    fields: [tagsPivot.tagId],
    references: [tags.id],
  }),
}));

export type TagPivot = typeof tagsPivot.$inferSelect & {
  tag: typeof tags.$inferSelect;
};
export type NewTagPivot = typeof tagsPivot.$inferInsert;
