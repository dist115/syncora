import crypto from 'crypto';
import { env } from '@/env.mjs';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

/**
 * Generates a random 256-bit encryption key
 * @returns Hex string of the generated key
 */
export function generateUserEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Encrypts data using the master key
 * Used to encrypt user keys before storing in database
 */
export function encryptWithMasterKey(data: string): string {
  const masterKey = Buffer.from(env.MASTER_ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Return: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts data using the master key
 * Used to decrypt user keys from database
 */
export function decryptWithMasterKey(encryptedData: string): string {
  const masterKey = Buffer.from(env.MASTER_ENCRYPTION_KEY, 'hex');
  
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Encrypts file buffer with user's encryption key
 * @param fileBuffer The file content as Buffer
 * @param userKeyHex The user's encryption key (hex string)
 * @returns Encrypted buffer with IV and auth tag prepended
 */
export function encryptFile(fileBuffer: Buffer, userKeyHex: string): Buffer {
  const userKey = Buffer.from(userKeyHex, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, userKey, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(fileBuffer),
    cipher.final(),
  ]);
  
  const authTag = cipher.getAuthTag();
  
  // Prepend IV and authTag to encrypted data for storage
  return Buffer.concat([iv, authTag, encrypted]);
}

/**
 * Decrypts file buffer with user's encryption key
 * @param encryptedBuffer The encrypted file with IV and auth tag prepended
 * @param userKeyHex The user's encryption key (hex string)
 * @returns Decrypted file buffer
 */
export function decryptFile(encryptedBuffer: Buffer, userKeyHex: string): Buffer {
  const userKey = Buffer.from(userKeyHex, 'hex');
  
  // Extract IV, auth tag, and encrypted data
  const iv = encryptedBuffer.subarray(0, IV_LENGTH);
  const authTag = encryptedBuffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = encryptedBuffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, userKey, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  
  return decrypted;
}

/**
 * Validates that a string is a valid hex-encoded key of correct length
 */
export function isValidEncryptionKey(key: string): boolean {
  return /^[0-9a-f]{64}$/i.test(key);
}