import 'server-only';
import { db } from '@/db';
import { Contact, contacts as contactModel, } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';

type ContactsWithCount = {
    contacts: Contact[];
    count: number;
};

export const ContactService = {

    getContacts: async (params: {
        size?: number;
        page?: number;
    }): Promise<ContactsWithCount> => {
        const size = Number(params.size) || 10;
        const page = params.page ? Number(params.page) - 1 : 0;
        const { contacts, count }: ContactsWithCount = await db.transaction(
            async (db): Promise<any> => {
                const contacts = await db.query.contacts.findMany({
                    orderBy: [desc(contactModel.createdAt)],
                    offset: page * size,
                    limit: size,
                });
                const result = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(contactModel)
                const count = result[0].count;
                return {
                    contacts,
                    count,
                };
            }
        );
        return { contacts, count };
    },

    create: async (data: Contact) => {
        const [inserted] = await db.insert(contactModel).values(data).returning();

        return inserted;
    },
};
