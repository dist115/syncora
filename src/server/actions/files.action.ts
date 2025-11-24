'use server';

import { revalidateTag } from 'next/cache';
import { CompleteFile } from '@/db/schema';
import { v4 } from 'uuid';

import { GB, KB, MB } from '@/config/file';
import { MESSAGES } from '@/config/messages';
import { FileSortType, SortOrderType } from '@/config/sorting';
import { handleServerError } from '@/lib/utils/error';
import { getMonthName, months } from '@/lib/utils/month';
import { duplicateS3File } from '@/lib/utils/s3/duplicate';
import { getCurrentUser } from '@/lib/utils/session';

import { FilesService } from '../service';
import { getCurrentTeam } from './team.action';

export async function getFileByHash(hash: string) {
  return await FilesService.getFileByHash(hash);
}

export async function getFiles(
  params: {
    size?: number;
    page?: number;
    search?: string;
    sort?: FileSortType;
    order?: SortOrderType;
    tag?: string;
    type?: string;
    isFavourite?: boolean;
  },
  options?: {
    excludeByType?: string;
    allFiles?: boolean;
  }
) {
  const user = await getCurrentUser();
  if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);
  const teamId = Boolean(user?.currentTeamId) ? user?.currentTeamId : null;
  const filesOptions = {
    userId: user?.id,
    teamId: teamId,
    excludeByType: options?.excludeByType,
    allFiles: options?.allFiles,
  };
  const files = await FilesService.getFiles(params, filesOptions);
  revalidateTag('get-files');
  return files;
}

export async function getAllFiles(params: {
  page?: number;
  size?: number;
  search?: string;
  type?: string;
  team?: string;
}) {
  const data = await FilesService.getFiles(params, {
    allFiles: true,
    teamId: params.team,
  });
  return { ...data, files: data.files as CompleteFile[] };
}

export async function getAllFileSize(params: {
  page?: number;
  size?: number;
  search?: string;
  type?: string;
  team?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);
  const teamId = Boolean(user?.currentTeamId) ? user?.currentTeamId : null;
  const options = { userId: user?.id, teamId: teamId };
  const data = await FilesService.getFiles(params, options);

  let totalSize = 0;
  data.files.map((file) => {
    if (file.type !== 'folder') {
      totalSize += file?.fileSize ?? 0;
    }
  });

  return {
    bytes: totalSize,
    kb: (totalSize / KB).toFixed(2),
    mb: (totalSize / MB).toFixed(2),
    gb: (totalSize / GB).toFixed(2),
  };
}

export async function getFileById(id: string) {
  return await FilesService.getFileById(id);
}
export async function getFileByType(type: string) {
  return await FilesService.getFileByType(type);
}

export async function getTrashFiles(params: any) {
  const user = await getCurrentUser();
  const teamId = Boolean(user?.currentTeamId) ? user?.currentTeamId : null;
  return await FilesService.getTrashFiles(params, user?.id, teamId);
}
export async function getFavouriteFiles(params: any) {
  const user = await getCurrentUser();
  const teamId = Boolean(user?.currentTeamId) ? user?.currentTeamId : null;
  revalidateTag('get-all-files');
  revalidateTag('get-files');
  return await FilesService.getFavouriteFiles(params, user?.id, teamId);
}

export const uploadFile = async (inputs: any) => {
  const user = await getCurrentUser();

  if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);

  const create: any = [];
  for (let i = 0; i < inputs.length; i++) {
    const input = {
      ...inputs[i],
      userId: user?.id,
      teamId: Boolean(user?.currentTeamId) ? user?.currentTeamId : null,
    };
    create.push(input);
  }

  const files = await FilesService.uploadFile(create);
  revalidateTag('get-files');
  revalidateTag('get-all-files');
  return files;
};

export const shareFile = async (id: string) => {
  const file = await FilesService.shareFile(id);
  revalidateTag('get-files');
  return file;
};

export const makeFilePrivate = async (id: string) => {
  const file = await FilesService.makePrivate(id);
  revalidateTag('get-files');
  revalidateTag('get-all-files');
  return file;
};

export const makeFileFavourite = async (id: string, flag: boolean) => {
  try {
    const file = await FilesService.makeFavourite(id, flag);
    revalidateTag('get-files');
    revalidateTag('get-all-files');
    return file;
  } catch (error) {
    return handleServerError(error);
  }
};

export const duplicateFile = async (file: any) => {
  if ('folder' !== file.type) {
    const sourceKey = file.fileName;
    const destinationKey = `image/${v4()}-${file.name} Copy.${file.extension}`;

    const newFileName = await duplicateS3File(sourceKey, destinationKey);

    if (newFileName) {
      file.fileName = newFileName;
      file.name = `${file.name} Copy`;
      delete file.id;
      delete file.createdAt;
      delete file.updatedAt;
      const duplicatedFile = await FilesService.uploadFile([file]);
      revalidateTag('get-files');
      return duplicatedFile;
    }
  }
};

export const deleteAllTrashedFiles = async (fileIds: string[]) => {
  const files = await FilesService.bulkFilesDelete(fileIds);
  revalidateTag('get-files');
  revalidateTag('get-all-files');
  return files;
};
