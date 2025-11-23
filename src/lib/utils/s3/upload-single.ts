import { API } from '@/config/api';
import { MESSAGES } from '@/config/messages';
import { handleErrorMessage } from '../error';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';

/**
 * Encrypts file on client side before upload
 */
async function encryptFileClient(
  file: File,
  encryptionKeyHex: string
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);

  // Convert hex key to bytes
  const keyBytes = new Uint8Array(
    encryptionKeyHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  // Generate random IV (16 bytes for AES)
  const iv = crypto.getRandomValues(new Uint8Array(16));

  // Import key for Web Crypto API
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  // Encrypt the file
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    cryptoKey,
    fileBuffer
  );

  // Combine IV + encrypted data
  const encryptedArray = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);

  return new Blob([combined], { type: 'application/octet-stream' });
}

export const uploadSingleFile = async (
  file: File,
  progressHandler?: (prog: number, signal?: AbortController) => void
) => {
  const fileName = encodeURIComponent(file.name);
  const fileType = encodeURIComponent(file.type);

  try {
    // Get signed URL and encryption key
    const response = await fetch(
      `${API.UPLOAD_URL}?fileName=${fileName}&fileType=${fileType}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { url, fields, encryptionKey } = await response.json();

    // Encrypt file before upload
    const encryptedBlob = await encryptFileClient(file, encryptionKey);

    const controller = new AbortController();
    const config: AxiosRequestConfig = {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      onUploadProgress: function (progressEvent: AxiosProgressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total as number)
        );
        if (progressHandler) {
          progressHandler(percentCompleted, controller);
        }
      },
    };

    await axios.put(url, encryptedBlob, config);

    return fields.key;
  } catch (error) {
    handleErrorMessage(error, MESSAGES.ERROR_WHILE_UPLOADING_IMAGE);
    throw error;
  }
};