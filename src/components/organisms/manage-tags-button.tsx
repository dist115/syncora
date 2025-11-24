'use client';

import { Tags } from '@/db/schema';
import { RiPriceTag3Line } from 'react-icons/ri';
import { Button } from 'rizzui';

import { useDrawer } from '@/lib/store/drawer.store';

import ManageTagsForm from './forms/manage-tags-form';

const title = 'Manage Tags';
const description = 'Create, edit, and delete tags.';

export const ManageTagsButton = ({ tags }: { tags: Tags[] }) => {
  const { openDrawer } = useDrawer();

  return (
    <Button
      className="px-3 sm:px-4"
      variant="outline"
      onClick={() => {
        openDrawer(ManageTagsForm, title, description, { tags });
      }}
    >
      <RiPriceTag3Line className="w-4 h-auto" />
      <span className="ms-2">Manage Tags</span>
    </Button>
  );
};
