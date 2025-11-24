import { createId } from "@paralleldrive/cuid2";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = pgTable('contacts', {

    id: varchar('id', { length: 255 })
        .$defaultFn(() => createId())
        .primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 255 }),
    message: varchar('message', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),


})
export type Contact = typeof contacts.$inferInsert;
export const ContactUsSchema = createInsertSchema(contacts);
export type CreateContactInput = z.infer<typeof ContactUsSchema>;
