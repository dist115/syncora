import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/env.mjs';
import { db } from '@/db';
import { authUsers, files } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { decryptWithMasterKey, decryptFile } from '@/lib/utils/encryption';
import { validateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get('key');

  if (!fileKey) {
    return NextResponse.json({ error: 'No key' }, { status: 400 });
  }

  const session = await validateRequest();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Verify file ownership
    const file = await db.query.files.findFirst({
      where: eq(files.fileName, fileKey),
    });

    if (!file || file.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 2. Get user's encrypted key
    const authUser = await db.query.authUsers.findFirst({
      where: eq(authUsers.userId, session.user.id),
    });

    if (!authUser?.encryptionKey) {
      return NextResponse.json({ error: 'No encryption key' }, { status: 400 });
    }

    // 3. Decrypt user's key
    const userKey = decryptWithMasterKey(authUser.encryptionKey);

    // 4. Download encrypted file from R2
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: env.CLOUDFLARE_ENDPOINT,
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });

    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: fileKey,
      })
    );

    if (!response.Body) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // 5. Read encrypted file
    const encryptedBuffer = Buffer.from(
      await response.Body.transformToByteArray()
    );

    // 6. DECRYPT FILE (Magic happens here!)
    const decryptedBuffer = decryptFile(encryptedBuffer, userKey);

    // 7. Return decrypted file
    return new NextResponse(decryptedBuffer, {
      headers: {
        'Content-Type': file.mime || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.name}"`,
        'Content-Length': decryptedBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}