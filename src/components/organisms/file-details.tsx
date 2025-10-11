import React, { Dispatch, SetStateAction } from 'react';
import { CompleteFile } from '@/db/schema';
import { User } from 'lucia';
import { RiCloseLine, RiFileList2Line, RiSendPlaneLine } from 'react-icons/ri';
import { ActionIcon, Tab } from 'rizzui';

import { useDrawerState } from '@/lib/store/drawer.store';
import { cn } from '@/lib/utils/cn';
import { Flex } from '@/components/atoms/layout';
import FileMetaInformation from '@/components/molecules/file/file-meta';

import FileComments from './file-comments';

export default function FileDetails({
  file,
  user,
  setDetailsState,
  className,
}: {
  file: CompleteFile;
  user: User;
  setDetailsState: Dispatch<SetStateAction<boolean>>;
  className?: string;
}) {
  const { closeDrawer } = useDrawerState();
  return (
    <Flex
      direction="col"
      align="start"
      justify="start"
      className={cn(
        'relative h-full pt-3 overflow-hidden bg-white dark:bg-steel-700/80',
        className
      )}
    >
      <Tab>
        <Tab.List>
          <Tab.ListItem activeClassName="font-medium">
            <RiFileList2Line size={16} className="text-steel-400 me-0.5" /> File
            Details
          </Tab.ListItem>
          <Tab.ListItem activeClassName="font-medium">
            <RiSendPlaneLine size={16} className="text-steel-400 me-0.5" />
            Comments
          </Tab.ListItem>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <FileMetaInformation file={file} />
          </Tab.Panel>
          <Tab.Panel>
            <FileComments file={file} user={user} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab>
      <ActionIcon
        className="rounded lg:hidden hover:bg-steel-100/50 dark:hover:bg-steel-600/50 absolute top-3 right-4"
        variant="text"
        onClick={() => {
          setDetailsState(false);
          closeDrawer();
        }}
      >
        <RiCloseLine className="text-steel-400" size={24} />
      </ActionIcon>
    </Flex>
  );
}
