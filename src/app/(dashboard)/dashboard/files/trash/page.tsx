import { CompleteFile } from '@/db/schema';
import { getTrashFiles } from '@/server/actions/files.action';

import { ShowFilesTrash } from '@/components/templates/show-files-trash';

export default async function Page({ searchParams }: { searchParams: any }) {
  const { files, count } = await getTrashFiles({ size: 50, ...searchParams });
  return <ShowFilesTrash files={files as CompleteFile[]} totalFiles={count} />;
}
