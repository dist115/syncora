import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/env.mjs';
import { db } from '@/db';
import { authUsers, files } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { decryptWithMasterKey, decryptFile } from '@/lib/utils/encryption';
import { cookies } from 'next/headers'; // ✅ Import cookies
import { lucia } from '@/auth'; // ✅ Import lucia

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const { fileId } = params;

  try {
    console.log('🔐 Decryption API called for file:', fileId);

    // ✅ FIXED: Get session using cookies directly
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
      console.error('❌ No session cookie found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    console.log('✅ Session cookie found:', sessionId);

    // Validate the session
    const { session, user } = await lucia.validateSession(sessionId);
    
    if (!session || !user) {
      console.error('❌ Invalid session');
      return NextResponse.json({ error: 'Unauthorized - Invalid session' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.id);

    // Step 2: Get file from database
    const file = await db.query.files.findFirst({
      where: eq(files.id, fileId),
    });

    if (!file) {
      console.error('❌ File not found in database:', fileId);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    console.log('✅ File found:', file.name);

    // Step 3: Verify ownership
    if (file.userId !== user.id) {
      console.error('❌ User does not own file. File user:', file.userId, 'Request user:', user.id);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('✅ Ownership verified');

    // Step 4: Get user's encryption key
    const authUser = await db.query.authUsers.findFirst({
      where: eq(authUsers.userId, user.id),
    });

    if (!authUser || !authUser.encryptionKey) {
      console.error('❌ No encryption key');
      return NextResponse.json({ error: 'No encryption key' }, { status: 400 });
    }

    console.log('✅ Encryption key found');

    // Step 5: Decrypt user's key
    const userEncryptionKey = decryptWithMasterKey(authUser.encryptionKey);
    console.log('✅ User key decrypted');

    // Step 6: Download from R2
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

    // Step 7: Decrypt file
    console.log('🔓 Decrypting...');
    
    const encryptedBuffer = Buffer.from(
      await response.Body.transformToByteArray()
    );

    const decryptedBuffer = decryptFile(encryptedBuffer, userEncryptionKey);
    
    console.log('✅ File decrypted, size:', decryptedBuffer.length, 'bytes');

    // Step 8: Return decrypted file
    return new NextResponse(decryptedBuffer, {
      status: 200,
      headers: {
        'Content-Type': file.mime || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${encodeURIComponent(file.name)}.${file.extension}"`,
        'Content-Length': decryptedBuffer.length.toString(),
        'Cache-Control': 'private, max-age=3600',
        // ✅ Add CORS headers for same-origin requests
        'Access-Control-Allow-Origin': env.NEXT_PUBLIC_BASE_URL || '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    });

  } catch (error) {
    console.error('❌ Decryption error:', error);
    return NextResponse.json(
      { 
        error: 'Decryption failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}