import { me } from '@/server/actions/user.action';

import { UpdateProfileForm } from '@/components/organisms/forms/update-profile-form';

export default async function Page() {
  const user = await me();

  return (
    <>
      <UpdateProfileForm user={user} />
    </>
  );
}
