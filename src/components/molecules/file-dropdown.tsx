'use client';

import React from 'react';
import { User } from 'lucia';
import { PiPlusBold } from 'react-icons/pi';
import { Button, Dropdown } from 'rizzui';

import { PERMISSIONS } from '@/config/permission';
import { MODULE } from '@/config/permission/common';
import Allow from '@/components/atoms/allow';
import { CreateFolderButton } from '@/components/organisms/create-folder-button';
import { UploadFileButton } from '@/components/organisms/upload-file-button';

export function FileDropdown({
  user,
  permissions,
  parentId,
  availableStorage,
}: {
  user: User;
  permissions: any;
  parentId: any;
  availableStorage?: number;
}) {
  return (
    <Dropdown placement="bottom-end">
      <Dropdown.Trigger
        as="button"
        aria-label="Add new button"
        className="w-full"
      >
        <Button as="span" className="px-3 sm:px-4 w-full">
          <PiPlusBold className="h-4 w-4" />
          <span className="ms-1.5 ">Add New</span>
        </Button>
      </Dropdown.Trigger>
      {user.currentTeamId ? (
        <Dropdown.Menu className="space-y-0.5 border dark:border-steel-600/60 w-40 lg:w-52 dark:bg-steel-700 dark:text-steel-300 border-steel-200/60">
          <Allow
            access={PERMISSIONS.UPLOAD_FILES}
            mod={MODULE.FILE}
            rules={permissions}
            fallback={
              <Dropdown.Item>Don`t have permission to upload</Dropdown.Item>
            }
          >
            <Dropdown.Item>
              <UploadFileButton
                parentId={parentId}
                availableStorage={availableStorage}
              />
            </Dropdown.Item>
          </Allow>
          <Allow
            access={PERMISSIONS.CREATE_FOLDER}
            mod={MODULE.FILE}
            rules={permissions}
            fallback={
              <Dropdown.Item>
                Don`t have permission to create folder
              </Dropdown.Item>
            }
          >
            <Dropdown.Item>
              <CreateFolderButton parentId={parentId} />
            </Dropdown.Item>
          </Allow>
        </Dropdown.Menu>
      ) : (
        <Dropdown.Menu className="space-y-0.5 border dark:border-steel-600/60 dark:bg-steel-700 dark:text-steel-300 border-steel-200/60 w-40 lg:w-52">
          <Dropdown.Item>
            <UploadFileButton
              parentId={parentId}
              availableStorage={availableStorage}
            />
          </Dropdown.Item>

          <Dropdown.Item>
            <CreateFolderButton parentId={parentId} />
          </Dropdown.Item>
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
}
