'use server';

import { CopyObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { env } from '@/env.mjs';

// USING CLOUDFLARE R2 
const bucketName = env.R2_BUCKET_NAME as string;
const secretAccessKey = env.CLOUDFLARE_SECRET_ACCESS_KEY as string;
const accessKeyId = env.CLOUDFLARE_ACCESS_KEY_ID as string;
const endpoint = env.CLOUDFLARE_ENDPOINT as string;
const s3Client = new S3Client({
  region: 'auto',
  endpoint: endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey
  },
});

export async function duplicateS3File(
  sourceKey: string,
  destinationKey: string
) {
  try {
    const copyObjectParams = {
      Bucket: bucketName,
      CopySource: encodeURI(`/${bucketName}/${sourceKey}`),
      Key: destinationKey,
    };

    const copyObjectCommand = new CopyObjectCommand(copyObjectParams);

    await s3Client.send(copyObjectCommand);

    return destinationKey;
  } catch (error) {
    console.error('Error:', error);
  }
}
