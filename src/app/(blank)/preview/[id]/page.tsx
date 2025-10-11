import { notFound } from 'next/navigation';
import { CompleteFile } from '@/db/schema';
import { getFileById } from '@/server/actions/files.action';

import { getCurrentUser } from '@/lib/utils/session';
import { FilePreview } from '@/components/templates/file-perview';

export default async function Page({ params }: { params: { id: string } }) {
  const [user, file] = await Promise.all([
    getCurrentUser(),
    getFileById(params.id),
  ]);

  if (!file) {
    throw notFound();
  }

  return <FilePreview file={file as CompleteFile} user={user} />;
}
