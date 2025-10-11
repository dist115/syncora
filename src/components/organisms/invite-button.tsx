'use client';

import { TeamRole } from '@/db/schema';
import { RiUserAddLine } from 'react-icons/ri';
import { Button } from 'rizzui';

import { useDrawer } from '@/lib/store/drawer.store';
import { InviteMemberForm } from '@/components/organisms/forms/invite-member-form';

export const InviteButton = ({ roles,className }: { roles: TeamRole[],className?: string }) => {
  const { openDrawer } = useDrawer();

  const title = 'Add team member';
  const description = 'Add your team member by sending invitation.';

  return (
    <Button
      className={className}
      onClick={() => {
        openDrawer(InviteMemberForm, title, description, { roles });
      }}
    >
      <RiUserAddLine className="mr-1.5 w-[18px] h-auto" />
      Invite Member
    </Button>
  );
};
