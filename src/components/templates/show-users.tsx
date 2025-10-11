import { type CompleteUser } from '@/db/schema';

import { Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { CreateUserButton } from '@/components/organisms/create-user-button';
import { UsersTable } from '@/components/organisms/users-table';

export const ShowUsers = async ({
  users,
  userId,
  totalUsers,
}: {
  users: CompleteUser[];
  userId: string;
  totalUsers: number;
}) => {
  return (
    <Flex direction="col" align="stretch" className="gap-0">
      <PageHeader
        title="Manage Users"
        description="View and manage your users"
        titleClassName="text-xl"
        className="items-start flex-col 375px:flex-row w-full 375px:w-auto 375px:items-center"
        headingWrapperClassName="w-auto shrink"
        childrenClassName="w-full 375px:w-auto shrink "
      >
        <Flex justify="end" className="w-full">
          <CreateUserButton />
        </Flex>
      </PageHeader>

      <UsersTable users={users} userId={userId} totalUsers={totalUsers} />
    </Flex>
  );
};
