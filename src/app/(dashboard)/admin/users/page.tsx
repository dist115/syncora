import { CompleteUser } from '@/db/schema';
import { getUsers, me } from '@/server/actions/user.action';

import { ShowUsers } from '@/components/templates/show-users';

export default async function Page({ searchParams }: { searchParams: any }) {
  const { users, count } = await getUsers(searchParams);
  const user = await me();

  return (
    <ShowUsers
      users={users as CompleteUser[]}
      userId={user?.id as string}
      totalUsers={count}
    />
  );
}
