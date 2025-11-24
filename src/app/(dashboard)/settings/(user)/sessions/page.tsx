import { cookies } from 'next/headers';
import { getUserSession, me } from '@/server/actions/user.action';
import { lucia } from '@/auth';

import { UpdateProfileForm } from '@/components/organisms/forms/update-profile-form';
import { UserSessions } from '@/components/templates/user-sessions';

export default async function Page() {
  const user = await me();
  const nextCookies = cookies();
  const sessionToken = nextCookies.get(lucia.sessionCookieName);
  let session;
  if (sessionToken && user) {
    session = await getUserSession(user.id);
  }

  return (
    <>
      {sessionToken && (
        <UserSessions session={session} sessionToken={sessionToken?.value} />
      )}
    </>
  );
}
