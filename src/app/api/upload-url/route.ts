import { NextResponse } from 'next/server';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 } from 'uuid';

import { env } from '@/env.mjs';
import { MESSAGES } from '@/config/messages';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileType = searchParams.get('fileType');
  const fileName = searchParams.get('fileName');

  if (!fileType || !fileName) {
    return NextResponse.json(
      { error: MESSAGES.MISSING_FILETYPE_OR_FILENAME },
      { status: 400 }
    );
  }

  const key = `image/${v4()}-${fileName}`;
  const endpoint = env.CLOUDFLARE_ENDPOINT as string;
  const accessKeyId = env.CLOUDFLARE_ACCESS_KEY_ID as string;
  const secretAccessKey = env.CLOUDFLARE_SECRET_ACCESS_KEY as string;
  const bucketName = env.R2_BUCKET_NAME as string;

  const s3Bucket = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  const signedUrl = await getSignedUrl(
    s3Bucket,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
    { expiresIn: 3000 }
  );
  return NextResponse.json({
    url: signedUrl,
    fields: {
      key,
    },
  });
}
