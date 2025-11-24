import mime from 'mime';

export function getFileType(file: File) {
  const mimeArray = file && file.type.split('/');
  const changeType = ['application', 'text'];
  const fileType =
    mimeArray && changeType.includes(mimeArray[0])
      ? mime.getExtension(file.type)
      : mimeArray
        ? mimeArray[0]
        : '';
  return fileType;
}
