'use server';

import { DeleteObjectsCommand, S3Client } from '@aws-sdk/client-s3';

import { env } from '@/env.mjs';

export const deleteMultipleFiles = async (filesPathInS3: string[]) => {
  const bucketName = env.R2_BUCKET_NAME as string;
  const secretAccessKey = env.CLOUDFLARE_SECRET_ACCESS_KEY as string;
  const accessKeyId = env.CLOUDFLARE_ACCESS_KEY_ID as string;
  const endpoint = env.CLOUDFLARE_ENDPOINT as string;

  const params = {
    Bucket: bucketName,
    Delete: {
      Objects: filesPathInS3.map((key) => ({ Key: key })),
      Quiet: false
    },
  };

  const client = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey
    },
  });
  return await client.send(new DeleteObjectsCommand(params));
};
