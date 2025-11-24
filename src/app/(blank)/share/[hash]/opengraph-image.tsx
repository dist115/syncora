import { default as NextImage } from 'next/image';
import { ImageResponse } from 'next/og';
import { getFileByHash } from '@/server/actions/files.action';

import { getS3FileLink } from '@/lib/utils/file';

export const alt = 'Shared File';
export const size = {
  width: 1200,
  height: 628,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { hash: string } }) {
  const file = await getFileByHash(params.hash);

  if (!file) {
    return new ImageResponse(
      (
        <div tw="flex w-full h-full flex-col justify-center items-center bg-slate-200 items-stretch">
          <div tw="w-full text-center text-5xl">File not found</div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  const fileUrl = getS3FileLink(file.fileName);

  return new ImageResponse(
    (
      <div tw="flex w-full h-full flex-col items-center justify-center bg-slate-200 items-stretch">
        {file.type === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fileUrl}
            alt=""
            tw="flex-1 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <div tw="text-center text-5xl">{`File Shared: ${file?.name}`}</div>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
