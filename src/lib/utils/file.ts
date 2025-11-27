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
<<<<<<< HEAD

/**
 * ⚠️ DEPRECATED: This function returns direct R2 links (encrypted files)
 * Use getDecryptedFileLink() instead for encrypted files
 */
=======
<<<<<<< HEAD


export function getR2FileLink(fileName: string) {
  // Use the public Cloudflare R2 URL
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_URL || process.env.NEXT_PUBLIC_UPLOAD_URL;
  
  // Remove leading slash if present
  const cleanFileName = fileName.startsWith('/') ? fileName.slice(1) : fileName;
  
  return `${baseUrl}/${cleanFileName}`;
}


=======
>>>>>>> e257f1936ed451c16387ee5b07d4aeb3b80b10e8
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
<<<<<<< HEAD

/**
 * ✅ NEW: Get decrypted file link
 * 
 * Returns a link to the decryption API endpoint instead of direct R2 link.
 * This ensures files are decrypted server-side before being served to users.
 * 
 * @param fileId - The file ID from database
 * @returns URL to decryption endpoint (e.g., /api/file/abc123)
 * 
 * Example:
 * const url = getDecryptedFileLink(file.id);
 * // Returns: "/api/file/clx123abc456"
 */
export function getDecryptedFileLink(fileId: string): string {
  // This points to our decryption API endpoint
  return `/api/file/${fileId}`;
}

=======
>>>>>>> cafdcd0276b654aa9be83d16971b317ccdea35bf
>>>>>>> e257f1936ed451c16387ee5b07d4aeb3b80b10e8
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