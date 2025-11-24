'use client';

import { decryptFileComplete, base64ToArrayBuffer } from './encryption';

export async function downloadAndDecryptFile(
  fileUrl: string,
  encryptedKey: string,
  iv: string,
  password: string,
  salt: string,
  originalFilename: string
) {
  try {
    // Fetch encrypted file
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch encrypted file');
    }
    const encryptedData = await response.arrayBuffer();

    // Convert salt from base64
    const saltArray = new Uint8Array(base64ToArrayBuffer(salt));

    // Decrypt the file
    const decryptedData = await decryptFileComplete(
      encryptedData,
      encryptedKey,
      iv,
      password,
      saltArray
    );

    // Create download link
    const blob = new Blob([decryptedData]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
}