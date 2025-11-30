import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import { env } from '@/env.mjs';
import { db } from '@/db';
import { authUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { decryptWithMasterKey, encryptFile } from '@/lib/utils/encryption';
import { validateRequest } from '@/lib/utils/auth';

// Change from GET to POST
export async function POST(request: NextRequest) {
  const session = await validateRequest();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get file from request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    // 2. Get user's encrypted key from DB
    const authUser = await db.query.authUsers.findFirst({
      where: eq(authUsers.userId, session.user.id),
    });

    if (!authUser?.encryptionKey) {
      return NextResponse.json({ error: 'Setup encryption first' }, { status: 400 });
    }

    // 3. Decrypt user's key using master key
    const userKey = decryptWithMasterKey(authUser.encryptionKey);

    // 4. Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 5. ENCRYPT FILE (This is where the magic happens!)
    const encryptedBuffer = encryptFile(fileBuffer, userKey);

    // 6. Upload encrypted file to R2
    const key = `files/${session.user.id}/${v4()}-${file.name}`;
    
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: env.CLOUDFLARE_ENDPOINT,
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Body: encryptedBuffer,
        ContentType: 'application/octet-stream',
      })
    );

    // 7. Return file key
    return NextResponse.json({
      success: true,
      key,
      fileName: file.name,
      fileSize: file.size,
      encryptedSize: encryptedBuffer.length,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}