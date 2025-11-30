import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/env.mjs';
import { db } from '@/db';
import { authUsers, files } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { decryptWithMasterKey, decryptFile } from '@/lib/utils/encryption';

/**
 * Public file access endpoint for shared files
 * No authentication required - validates file is public via hash
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
) {
  const { hash } = params;

  try {
    console.log('🌐 Public file access requested for hash:', hash);

    // Step 1: Find file by hash and verify it's public
    const file = await db.query.files.findFirst({
      where: eq(files.hash, hash),
    });

    if (!file) {
      console.error('❌ File not found for hash:', hash);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Step 2: Verify file is public (shared)
    if (!file.isPublic) {
      console.error('❌ File is not public:', file.id);
      return NextResponse.json({ error: 'File is not shared publicly' }, { status: 403 });
    }

    console.log('✅ Public file found:', file.name);

    // Step 3: Get file owner's encryption key
    const authUser = await db.query.authUsers.findFirst({
      where: eq(authUsers.userId, file.userId),
    });

    if (!authUser || !authUser.encryptionKey) {
      console.error('❌ No encryption key for file owner');
      return NextResponse.json({ error: 'File encryption key not found' }, { status: 500 });
    }

    console.log('✅ Owner encryption key found');

    // Step 4: Decrypt owner's key using master key
    const userEncryptionKey = decryptWithMasterKey(authUser.encryptionKey);
    console.log('✅ Owner key decrypted');

    // Step 5: Download encrypted file from R2
    console.log('📥 Downloading from R2:', file.fileName);
    
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: env.CLOUDFLARE_ENDPOINT as string,
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID as string,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY as string,
      },
      forcePathStyle: true,
    });

    const command = new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME as string,
      Key: file.fileName,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      console.error('❌ No file body from R2');
      return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });
    }

    console.log('✅ File downloaded from R2');

    // Step 6: Decrypt file
    console.log('🔓 Decrypting...');
    
    const encryptedBuffer = Buffer.from(
      await response.Body.transformToByteArray()
    );

    const decryptedBuffer = decryptFile(encryptedBuffer, userEncryptionKey);
    
    console.log('✅ File decrypted for public access, size:', decryptedBuffer.length, 'bytes');

    // Step 7: Return decrypted file
    return new NextResponse(decryptedBuffer, {
      status: 200,
      headers: {
        'Content-Type': file.mime || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${encodeURIComponent(file.name)}.${file.extension}"`,
        'Content-Length': decryptedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Public files can be cached
        'Access-Control-Allow-Origin': '*', // Allow from any origin for shared files
        'Access-Control-Allow-Methods': 'GET',
      },
    });

  } catch (error) {
    console.error('❌ Public file access error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to access file', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}