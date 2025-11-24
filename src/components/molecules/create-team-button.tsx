'use client';

import { RiAddLine } from 'react-icons/ri';
import { Button } from 'rizzui';
import { useDrawer } from '@/lib/store/drawer.store';
import { CreateTeamForm } from '@/components/organisms/forms/create-team-form';

const title = 'Create Team';
const description = 'Create a new team to collaborate with your team member.';

export function CreateTeamButton() {
  const { openDrawer } = useDrawer();

  return (
    <Button
      onClick={() => openDrawer(CreateTeamForm, title, description)}
      className="w-full [@media(min-width:375px)]:w-auto"
    >
      <RiAddLine className="mr-1.5 w-5 h-auto" />
      Create Team
    </Button>
  );
}
