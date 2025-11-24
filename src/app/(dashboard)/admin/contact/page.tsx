import { getAllContact } from '@/server/actions/contact-us.action';

import { Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { ContactsTable } from '@/components/organisms/contacts-table';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: any }) {
  const { contacts, count } = await getAllContact(searchParams);

  return (
    <>
      <Flex direction="col" align="stretch" className="gap-0">
        <PageHeader
          title="All Contacts & Messages"
          description="View all the messages sent via contact-us form "
          titleClassName="text-xl"
        />
        <ContactsTable contacts={contacts as any} totalContacts={count} />
      </Flex>
    </>
  );
}
