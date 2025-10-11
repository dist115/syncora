import React, { SVGProps } from 'react';

import {
  DocFileIcon,
  DocxFileIcon,
  ExcelFileIcon,
  FileIcon,
  ImageFileIcon,
  JsonFileIcon,
  MusicFileIcon,
  PdfFileIcon,
  TextFileIcon,
  VideoFileIcon,
  ZipFileIcon,
} from '@/components/atoms/icons/file-icons/file-real-icons';
import { FolderIcon } from '@/components/atoms/icons/folder';

const fileIcons = {
  docx: DocxFileIcon,
  doc: DocFileIcon,
  xlsx: ExcelFileIcon,
  image: ImageFileIcon,
  json: JsonFileIcon,
  audio: MusicFileIcon,
  pdf: PdfFileIcon,
  txt: TextFileIcon,
  video: VideoFileIcon,
  zip: ZipFileIcon,
  folder: FolderIcon,
};

export type FileIconType = keyof typeof fileIcons;

type GetIconProps = SVGProps<SVGElement> & {
  iconType: FileIconType | null;
};

export const DynamicFileIcon = ({ iconType, ...rest }: GetIconProps) => {
  if (!iconType || !Object.keys(fileIcons).includes(iconType)) {
    return <FileIcon {...rest} />;
  } else {
    const TagName = fileIcons[iconType as FileIconType];
    return !!TagName ? <TagName {...rest} /> : null;
  }
};
