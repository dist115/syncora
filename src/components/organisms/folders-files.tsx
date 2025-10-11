import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { CompleteFile, Folder } from '@/db/schema';
import { getFileById } from '@/server/actions/files.action';
import { moveFolder } from '@/server/actions/folders.action';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { isEmpty } from 'lodash';
import { User } from 'lucia';
import { Button, Text } from 'rizzui';
import { toast } from 'sonner';

import { cn } from '@/lib/utils/cn';
import { handleError } from '@/lib/utils/error';
import useQueryParams from '@/hooks/useQueryParam';
import { Card } from '@/components/atoms/card';
import { Droppable } from '@/components/atoms/droppable';
import { NoFilesIllustration } from '@/components/atoms/illustrations/fallbacks/no-files-illustration';
import { Box, Flex, Grid } from '@/components/atoms/layout';
import SimpleBar from '@/components/atoms/simplebar';
import { Fallback } from '@/components/molecules/Fallback';
import { FileView } from '@/components/molecules/file/file-view';
import { FolderView } from '@/components/molecules/folder/folder-view';

import { DynamicFileIcon, FileIconType } from '../atoms/dynamic-file-icon';
import { FilesLayoutType } from './file-layout-switcher';

type FoldersFilesTypes = {
  files: CompleteFile[];
  totalFiles: number;
  layout?: string;
  folders: Folder[];
  user: User;
  permissions?: any;
  currentTeam?: any;
  selectedFileFolderIds: string[];
  setSelectedFileFolderIds: Dispatch<SetStateAction<string[]>>;
};

export const FoldersFiles = ({
  files,
  totalFiles,
  folders,
  user,
  layout = 'grid',
  permissions,
  currentTeam,
  selectedFileFolderIds,
  setSelectedFileFolderIds,
}: FoldersFilesTypes) => {
  const { setQueryParams, queryParams } = useQueryParams();
  const [draggedItem, setDraggedItem] = useState<CompleteFile | null>(null);
  const [droppedTo, setDroppedTo] = useState<string | null>(null);

  const size = queryParams.size ? Number(queryParams.size) : 50;

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 20 pixels before activating drag
    activationConstraint: {
      distance: 20,
    },
  });

  const sensors = useSensors(mouseSensor);

  function handleDragOver(e: any) {
    setDroppedTo(e?.over?.id ?? null);
  }

  function handleDragStart(e: any) {
    setDraggedItem(e.active.data.current);
  }

  const handleDragEnd = async (e: any) => {
    if (e.over) {
      try {
        const { current: activeData } = e.active.data;
        const { current: overData } = e.over.data;
        const file = await getFileById(e.active.id);
        await moveFolder(
          e.active.id,
          e.over.id,
          null,
          file?.fileSize as number
        );
        toast.success(`${activeData.name} moved to ${overData.name}`, {
          duration: 10000,
        });
      } catch (error) {
        handleError(error);
      }
    }

    setDraggedItem(null);
    setDroppedTo(null);
  };

  const handleLoadMore = () => {
    setQueryParams({ size: size + 50 }, true);
  };

  if (isEmpty(files)) {
    return (
      <Flex justify="center" className="py-12">
        <Fallback
          illustration={NoFilesIllustration}
          illustrationClassName="w-[200px] md:w-[280px] h-auto"
          title="No files"
          subtitle="Please start uploading files"
        />
      </Flex>
    );
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragOver}
      modifiers={[restrictToWindowEdges]}
      sensors={sensors}
      id="file_manager_dnd"
    >
      {layout === 'grid' && (
        <Grid
          columns="2"
          className="gap-4 mb-8 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-7 3xl:grid-cols-8"
        >
          <FileElementList
            user={user}
            layout={layout}
            files={files}
            folders={folders}
            draggedItem={draggedItem}
            droppedTo={droppedTo}
            permissions={permissions}
            currentTeam={currentTeam}
            selectedFileFolderIds={selectedFileFolderIds}
            setSelectedFileFolderIds={setSelectedFileFolderIds}
          />
        </Grid>
      )}

      {layout === 'list' && (
        <Box className="mb-8">
          <SimpleBar className="">
            <Box className="min-w-[1200px] ">
              <Box className="w-full grid grid-cols-[1fr_200px_200px_200px_200px_50px] gap-0 px-1 border-t border-b border-steel-100 items-center dark:border-steel-600/60">
                <Text className="px-2.5 pl-[50px] first:border-l-0 font-medium border-l border-steel-100 text-steel-700 dark:text-steel-100 dark:border-steel-600/60 py-1.5">
                  Name
                </Text>
                <Text className="px-2.5 first:border-l-0 font-medium border-l border-steel-100 text-steel-700 dark:text-steel-100 py-1.5 dark:border-steel-600/60">
                  Uploaded By
                </Text>
                <Text className="px-2.5 first:border-l-0 font-medium border-l border-steel-100 text-steel-700 dark:text-steel-100 py-1.5 dark:border-steel-600/60">
                  Modified
                </Text>
                <Text className="px-2.5 first:border-l-0 font-medium border-l border-steel-100 text-steel-700 dark:text-steel-100 py-1.5 dark:border-steel-600/60">
                  File Size
                </Text>
                <Text className="px-2.5 first:border-l-0 font-medium border-l border-r border-steel-100 text-steel-700 dark:text-steel-100 py-1.5 dark:border-steel-600/60">
                  Sharing
                </Text>
              </Box>

              <FileElementList
                user={user}
                layout={layout}
                files={files}
                folders={folders}
                draggedItem={draggedItem}
                droppedTo={droppedTo}
                permissions={permissions}
                currentTeam={currentTeam}
                selectedFileFolderIds={selectedFileFolderIds}
                setSelectedFileFolderIds={setSelectedFileFolderIds}
              />
            </Box>
          </SimpleBar>
        </Box>
      )}

      {totalFiles > size && (
        <Flex justify="center">
          <Button onClick={handleLoadMore}>Load more</Button>
        </Flex>
      )}

      <DragOverlay dropAnimation={null}>
        {draggedItem ? (
          <DynamicDragOverlay
            draggedItem={draggedItem}
            layout={layout as FilesLayoutType}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// render file element list
type FoldersFilesTypesExtended = Omit<FoldersFilesTypes, 'totalFiles'> & {
  draggedItem?: CompleteFile | null;
  droppedTo?: string | null;
  selectedFileFolderIds: string[];
  setSelectedFileFolderIds: Dispatch<SetStateAction<string[]>>;
};

function FileElementList({
  files,
  draggedItem,
  folders,
  layout,
  droppedTo,
  user,
  permissions,
  currentTeam,
  selectedFileFolderIds,
  setSelectedFileFolderIds,
}: FoldersFilesTypesExtended) {
  return (
    <>
      {files.map((file: any) => {
        if (file?.type === 'folder') {
          return (
            <Fragment key={file.id}>
              {file?.id !== draggedItem?.id ? (
                <Droppable id={file.id} data={file}>
                  <FolderView
                    file={file}
                    folders={folders}
                    isDropping={file?.id === droppedTo}
                    layout={layout}
                    permissions={permissions}
                    currentTeam={currentTeam}
                    selectedFileFolderIds={selectedFileFolderIds}
                    setSelectedFileFolderIds={setSelectedFileFolderIds}
                  />
                </Droppable>
              ) : (
                <FolderView
                  file={file}
                  folders={folders}
                  layout={layout}
                  permissions={permissions}
                  currentTeam={currentTeam}
                  selectedFileFolderIds={selectedFileFolderIds}
                  setSelectedFileFolderIds={setSelectedFileFolderIds}
                />
              )}
            </Fragment>
          );
        }

        return (
          <FileView
            key={file.id}
            file={file}
            folders={folders}
            user={user}
            layout={layout}
            permissions={permissions}
            currentTeam={currentTeam}
            selectedFileFolderIds={selectedFileFolderIds}
            setSelectedFileFolderIds={setSelectedFileFolderIds}
          />
        );
      })}
    </>
  );
}

function DynamicDragOverlay({
  draggedItem,
  layout = 'grid',
}: {
  draggedItem: CompleteFile;
  layout?: FilesLayoutType;
}) {
  const listIconClassName = cn('w-5', draggedItem.type === 'folder' && 'w-6');
  const gridIconClassName = cn(
    'h-14 w-auto',
    draggedItem.type === 'folder' && 'w-14 h-auto'
  );

  return (
    <Card
      className={cn(
        'flex items-center px-4 py-2.5 bg-white border-steel-200 dark:border-steel-600/60',
        layout === 'grid' && 'flex-col py-4'
      )}
    >
      <DynamicFileIcon
        className={cn(
          layout === 'list' ? listIconClassName : gridIconClassName
        )}
        iconType={draggedItem?.type as FileIconType}
      />
      <Text
        className={cn(
          'w-full truncate text-steel-700 dark:text-steel-300 ml-4',
          layout === 'grid' && 'mt-5 text-center ml-0'
        )}
      >
        {draggedItem.type === 'folder' ? (
          draggedItem.name
        ) : (
          <span className="inline-flex items-center">
            <span
              className={cn(
                'max-w-[20ch] 3xl:max-w-[35ch] truncate',
                layout === 'grid' && 'max-w-[13ch] 3xl:max-w-[13ch]'
              )}
            >
              {draggedItem.name}.
            </span>
            <span>{draggedItem.extension}</span>
          </span>
        )}
      </Text>
    </Card>
  );
}
