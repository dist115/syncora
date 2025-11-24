import { CompleteFile, Folder } from '@/db/schema';

export const generateBreadcrumbs = (folders: Folder[], currentFolder: any) => {
  const breadcrumbs = [];

  while (currentFolder) {
    breadcrumbs.unshift(currentFolder);
    currentFolder = folders.find((item) => item.id === currentFolder.parentId);
  }

  return breadcrumbs;
};
