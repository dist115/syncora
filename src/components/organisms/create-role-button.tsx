'use client';

import { Permission } from '@/db/schema';
import { RiAddLine } from 'react-icons/ri';
import { Button } from 'rizzui';

import { useDrawer } from '@/lib/store/drawer.store';

import { CreateRoleForm } from './forms/create-role-form';

export const CreateRoleButton = ({
  permissions,
}: {
  permissions: Permission[];
}) => {
  const { openDrawer } = useDrawer();

  const title = 'Add new role';
  const description = 'Add your role.';

  return (
    <div>
      <Button
        className="whitespace-nowrap"
        onClick={() => {
          openDrawer(CreateRoleForm, title, description, { permissions });
        }}
      >
        <RiAddLine className="mr-1.5 w-5 h-auto" />
        Create Role
      </Button>
    </div>
  );
};
