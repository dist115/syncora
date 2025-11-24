'use client';

import { RiUserAddLine } from 'react-icons/ri';
import { Button } from 'rizzui';

import { useDrawer } from '@/lib/store/drawer.store';
import { CreateUserForm } from '@/components/organisms/forms/create-user-form';

export const CreateUserButton = () => {
  const { openDrawer } = useDrawer();

  const title = 'Add user';
  const description = 'Add a new user.';

  return (
    <Button
      onClick={() => {
        openDrawer(CreateUserForm, title, description);
      }}
      className="w-full 375px:w-auto"
    >
      <RiUserAddLine className="mr-1.5 w-4 h-auto" />
      Create User
    </Button>
  );
};
