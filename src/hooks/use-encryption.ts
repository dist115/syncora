'use client';

import { useState, useCallback } from 'react';
import {
  encryptFileComplete,
  decryptFileComplete,
  EncryptedFile,
} from '@/lib/crypto/encryption';

export function useEncryption() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [progress, setProgress] = useState(0);

  const encryptFile = useCallback(async (
    file: File,
    password: string
  ): Promise<EncryptedFile> => {
    setIsEncrypting(true);
    setProgress(0);

    try {
      // TODO: Add progress tracking for large files
      const encrypted = await encryptFileComplete(file, password);
      setProgress(100);
      return encrypted;
    } finally {
      setIsEncrypting(false);
      setProgress(0);
    }
  }, []);

  const decryptFile = useCallback(async (
    encryptedData: ArrayBuffer,
    encryptedKey: string,
    iv: string,
    password: string,
    salt: Uint8Array
  ): Promise<ArrayBuffer> => {
    setIsDecrypting(true);
    setProgress(0);

    try {
      const decrypted = await decryptFileComplete(
        encryptedData,
        encryptedKey,
        iv,
        password,
        salt
      );
      setProgress(100);
      return decrypted;
    } finally {
      setIsDecrypting(false);
      setProgress(0);
    }
  }, []);

  return {
    encryptFile,
    decryptFile,
    isEncrypting,
    isDecrypting,
    progress,
  };
}