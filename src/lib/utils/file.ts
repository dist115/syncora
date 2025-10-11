import mime from 'mime';

import { env } from '@/env.mjs';
import { MIME_TYPES } from '@/config/file';

import { UploadFileInput } from '../validations/file.schema';
import { uploadSingleFile } from './s3/upload-single';

export function acceptedMimeType() {
  const result = MIME_TYPES.reduce((acc, value) => {
    return { ...acc, [value]: [] };
  }, {});

  return result;
}

export function getS3FileLink(fileName: string) {
  let imageUrl = fileName;
  if (fileName) {
    if (fileName?.startsWith('http') === false && env.NEXT_PUBLIC_UPLOAD_URL) {
      imageUrl = `${env.NEXT_PUBLIC_UPLOAD_URL}/${fileName}`;
    }
  }
  return imageUrl;
}
export function getR2FileLink(fileName: string) {
  let fileUrl = fileName;

  if (
    fileName &&
    fileName?.startsWith('http') === false &&
    env.NEXT_PUBLIC_CLOUDFLARE_URL
  ) {
    fileUrl = `${env.NEXT_PUBLIC_CLOUDFLARE_URL}/${fileName}`;
  }

  return fileUrl;
}
export async function uploadFilesAndGetPaths(
  files: File[],
  handleProgress: (
    index: number,
    file: string
  ) => (progress: number, signal?: AbortController) => void,
  parentId: string
): Promise<any[]> {
  const paths = await Promise.all(
    files.map((file, index) => {
      const progressHandler = handleProgress(index, file.name);
      return uploadSingleFile(file, progressHandler);
    })
  );

  return prepareFile({ file: files }, paths, parentId);
}

export function prepareFile(
  inputs: UploadFileInput,
  paths: string[],
  parentId: string
) {
  return inputs.file.map((f: UploadFileInput['file'], i: number) => {
    if (typeof paths[i] !== 'undefined') {
      let regex = new RegExp(/\.[^/.]+$/);
      const mimeArray = f.type.split('/');
      const changeType = ['application', 'text'];
      return {
        name: f.name.replace(regex, ''),
        fileName: paths[i],
        mime: f.type,
        type: changeType.includes(mimeArray[0])
          ? mime.getExtension(f.type)
          : mimeArray[0],
        extension: mime.getExtension(f.type),
        fileSize: f.size,
        parentId,
      };
    }
  });
}

export function formatFoldersData(folders: any[], files: any[]) {
  const formattedData: any[] = [];
  folders.map((folder) => {
    let totalFileCount = 0;
    files?.map((file) => {
      if (file.parentId === folder.id) {
        totalFileCount++;
      }
    });
    const data: any = { ...folder, totalFileCount };
    formattedData.push(data);
  });
  return formattedData;
}
