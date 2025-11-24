/**
 * Syncora Encryption Library
 * Zero-knowledge end-to-end encryption for files
 */

// Encryption constants
export const ENCRYPTION_CONFIG = {
  ALGORITHM: 'AES-GCM',
  KEY_LENGTH: 256,
  IV_LENGTH: 12, // 96 bits for GCM
  TAG_LENGTH: 128, // 128 bits authentication tag
  SALT_LENGTH: 16,
  PBKDF2_ITERATIONS: 100000,
  KEY_DERIVATION: 'PBKDF2',
} as const;

// Type definitions
export interface EncryptedData {
  ciphertext: ArrayBuffer;
  iv: Uint8Array;
  salt?: Uint8Array;
}

export interface EncryptedFile {
  encryptedContent: Blob;
  encryptedKey: string; // Base64 encoded encrypted file key
  iv: string; // Base64 encoded IV
  metadata: {
    originalSize: number;
    encryptedSize: number;
    algorithm: string;
    version: string;
  };
}

/**
 * Generate a random encryption key
 */
export async function generateFileKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: ENCRYPTION_CONFIG.ALGORITHM,
      length: ENCRYPTION_CONFIG.KEY_LENGTH,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Derive a master key from password using PBKDF2
 */
export async function deriveMasterKey(
  password: string,
  salt?: Uint8Array
): Promise<{ key: CryptoKey; salt: Uint8Array }> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Generate salt if not provided
  const keySalt = salt || crypto.getRandomValues(new Uint8Array(ENCRYPTION_CONFIG.SALT_LENGTH));

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive key using PBKDF2
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: keySalt,
      iterations: ENCRYPTION_CONFIG.PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: ENCRYPTION_CONFIG.ALGORITHM,
      length: ENCRYPTION_CONFIG.KEY_LENGTH,
    },
    true, // extractable
    ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
  );

  return { key, salt: keySalt };
}

/**
 * Encrypt a file with a file-specific key
 */
export async function encryptFile(
  file: File,
  fileKey: CryptoKey
): Promise<{ encryptedData: Blob; iv: Uint8Array }> {
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(ENCRYPTION_CONFIG.IV_LENGTH));

  // Read file as ArrayBuffer
  const fileData = await file.arrayBuffer();

  // Encrypt the file
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: ENCRYPTION_CONFIG.ALGORITHM,
      iv: iv,
      tagLength: ENCRYPTION_CONFIG.TAG_LENGTH,
    },
    fileKey,
    fileData
  );

  // Convert to Blob
  const encryptedData = new Blob([encryptedBuffer], { type: 'application/octet-stream' });

  return { encryptedData, iv };
}

/**
 * Decrypt a file with a file-specific key
 */
export async function decryptFile(
  encryptedData: ArrayBuffer,
  fileKey: CryptoKey,
  iv: Uint8Array
): Promise<ArrayBuffer> {
  return await crypto.subtle.decrypt(
    {
      name: ENCRYPTION_CONFIG.ALGORITHM,
      iv: iv,
      tagLength: ENCRYPTION_CONFIG.TAG_LENGTH,
    },
    fileKey,
    encryptedData
  );
}

/**
 * Wrap (encrypt) a file key with the master key
 */
export async function wrapFileKey(
  fileKey: CryptoKey,
  masterKey: CryptoKey
): Promise<{ wrappedKey: ArrayBuffer; iv: Uint8Array }> {
  const iv = crypto.getRandomValues(new Uint8Array(ENCRYPTION_CONFIG.IV_LENGTH));

  const wrappedKey = await crypto.subtle.wrapKey(
    'raw',
    fileKey,
    masterKey,
    {
      name: ENCRYPTION_CONFIG.ALGORITHM,
      iv: iv,
      tagLength: ENCRYPTION_CONFIG.TAG_LENGTH,
    }
  );

  return { wrappedKey, iv };
}

/**
 * Unwrap (decrypt) a file key with the master key
 */
export async function unwrapFileKey(
  wrappedKey: ArrayBuffer,
  masterKey: CryptoKey,
  iv: Uint8Array
): Promise<CryptoKey> {
  return await crypto.subtle.unwrapKey(
    'raw',
    wrappedKey,
    masterKey,
    {
      name: ENCRYPTION_CONFIG.ALGORITHM,
      iv: iv,
      tagLength: ENCRYPTION_CONFIG.TAG_LENGTH,
    },
    {
      name: ENCRYPTION_CONFIG.ALGORITHM,
      length: ENCRYPTION_CONFIG.KEY_LENGTH,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Convert ArrayBuffer to Base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Complete file encryption workflow
 */
export async function encryptFileComplete(
  file: File,
  masterPassword: string
): Promise<EncryptedFile> {
  // 1. Derive master key from password
  const { key: masterKey, salt } = await deriveMasterKey(masterPassword);

  // 2. Generate file-specific key
  const fileKey = await generateFileKey();

  // 3. Encrypt the file
  const { encryptedData, iv: fileIv } = await encryptFile(file, fileKey);

  // 4. Wrap the file key with master key
  const { wrappedKey, iv: wrapIv } = await wrapFileKey(fileKey, masterKey);

  // 5. Prepare encrypted file object
  const encryptedFile: EncryptedFile = {
    encryptedContent: encryptedData,
    encryptedKey: arrayBufferToBase64(wrappedKey),
    iv: arrayBufferToBase64(fileIv),
    metadata: {
      originalSize: file.size,
      encryptedSize: encryptedData.size,
      algorithm: ENCRYPTION_CONFIG.ALGORITHM,
      version: '1.0',
    },
  };

  return encryptedFile;
}

/**
 * Complete file decryption workflow
 */
export async function decryptFileComplete(
  encryptedData: ArrayBuffer,
  encryptedKeyBase64: string,
  ivBase64: string,
  masterPassword: string,
  salt: Uint8Array
): Promise<ArrayBuffer> {
  // 1. Derive master key from password
  const { key: masterKey } = await deriveMasterKey(masterPassword, salt);

  // 2. Convert base64 to ArrayBuffer
  const wrappedKey = base64ToArrayBuffer(encryptedKeyBase64);
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));

  // 3. Unwrap the file key
  const fileKey = await unwrapFileKey(wrappedKey, masterKey, iv);

  // 4. Decrypt the file
  const decryptedData = await decryptFile(encryptedData, fileKey, iv);

  return decryptedData;
}