'use server';

import { revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';

import { MESSAGES } from '@/config/messages';
import { getCurrentUser } from '@/lib/utils/session';
import { applyValidation } from '@/lib/utils/validation';
import {
  UpdateFolderInput,
  UpdateFolderSchema,
} from '@/lib/validations/folder.schema';

import { FilesService, FolderSizeUpdateType, FoldersService, TeamService } from '../service';
import { handleServerError } from '@/lib/utils/error';

export async function getFolders(parentId: string, params: any) {
  const user = await getCurrentUser();
  if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);
  const teamId = Boolean(user.currentTeamId) ? user.currentTeamId : null;
  const options = { userId:user.id, teamId:teamId,allFiles:true,parentId:parentId };

  const folder = await FoldersService.find(parentId);

  if (!folder) {
    notFound();
  }

  if (folder.teamId !== teamId) {
    notFound();
  }

  if (Boolean(folder?.teamId)) {
    const isTeamMember = await TeamService.isMember(user.id, folder?.teamId);
    if (!isTeamMember) {
      notFound();
    }
  } else {
    if (folder?.userId !== user.id) {
      notFound();
    }
  }
  return await FoldersService.getFolders(params, options);;
}

export const createFolder = async (input: any) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);
    const { name } = input;
    input.fileName = name;
    input.userId = user?.id;

    input.teamId = Boolean(user?.currentTeamId) ? user?.currentTeamId : null;

    input.type = 'folder';
    const isFolderExists = await FoldersService.isFolderExists(input);
    if (isFolderExists) {
      const folder = await FoldersService.create(input);
      revalidateTag('get-files');
      return folder;
    }

  } catch (error) {
    return handleServerError(error);
  }

};

export const updateFolder = async (
  folderId: string,
  input: UpdateFolderInput
) => {
  try {
    const data = applyValidation(UpdateFolderSchema, input);

    const profile = await FoldersService.update(folderId, data);
    revalidateTag('get-files');
    return profile;

  } catch (error) {
    return handleServerError(error);
  }

};

export const moveToTrash = async (id: string) => {
  try {
    const folder = await FoldersService.trash(id);
    revalidateTag('get-files');
    return folder;
  } catch (error) {
    return handleServerError(error);
  }

};
export const moveMultipleToTrash = async (ids: string[]) => {
  try {
    const folder = await FoldersService.trashMultiple(ids);
    revalidateTag('get-files');
    return folder;
  } catch (error) {
    return handleServerError(error);
  }

};
export const emptyTrash = async () => {

  try {
    const folder = await FoldersService.emptyTrash();
    revalidateTag('get-files');
    return folder;
  } catch (error) {
    return handleServerError(error);
  }


};

export const folderDelete = async (id: string) => {
  try {
    const folder = await FoldersService.delete(id);

    revalidateTag('get-files');
    return folder;

  } catch (error) {
    return handleServerError(error);
  }

};

export const folderRestore = async (id: string) => {
  const folder = await FoldersService.restore(id);

  revalidateTag('get-files');
  return folder;
};

export const getAllFolders = async (userId: string, teamId: string | null, options?: {}) => {
  const folders = await FoldersService.getAll(userId, teamId, options);
  revalidateTag('get-files');
  return folders;
};

export const moveFolder = async (id: string, folderID: string | null, moveFromFolderID: string | null, fileSize: number | null) => {
  try {
    const move = await FoldersService.moveFolder(id, folderID, moveFromFolderID, fileSize);
    revalidateTag('get-files');
    return move;

  } catch (error) {
    return handleServerError(error)
  }

};

export const increaseFolderSize = async (folderID: string, fileSize: number) => {
  const updateSize = await FilesService.updateFolderSize(folderID, fileSize, FolderSizeUpdateType.increase);
  revalidateTag('get-files');
  return updateSize
}
export const decreaseFolderSize = async (folderID: string, fileSize: number) => {
  const updateSize = await FilesService.updateFolderSize(folderID, fileSize, FolderSizeUpdateType.decrease);
  revalidateTag('get-files');
  return updateSize
}