'use server';

import { db } from '@/db';
import { authUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  generateUserEncryptionKey,
  encryptWithMasterKey,
  isValidEncryptionKey,
} from '@/lib/utils/encryption';

export interface SetupEncryptionInput {
  authUserId: string;
  encryptionType: string;
  userProvidedKey: string | null;
}

export async function setupEncryptionAction(input: SetupEncryptionInput) {
  try {
    const { authUserId, encryptionType, userProvidedKey } = input;

    console.log('🔐 Setup encryption called with:', { authUserId, encryptionType, hasProvidedKey: !!userProvidedKey });

    // Validate input
    if (!authUserId) {
      console.error('❌ No authUserId provided');
      return {
        ok: false,
        error: 'User ID is required',
      };
    }

    // Validate encryption type
    if (encryptionType !== 'AES-256-GCM') {
      console.error('❌ Invalid encryption type:', encryptionType);
      return {
        ok: false,
        error: 'Invalid encryption type',
      };
    }

    // Generate or validate user key
    let userKey: string;
    if (userProvidedKey) {
      console.log('🔑 Using user-provided key');
      // Validate provided key
      if (!isValidEncryptionKey(userProvidedKey)) {
        console.error('❌ Invalid key format');
        return {
          ok: false,
          error: 'Invalid encryption key format. Must be 64 hexadecimal characters.',
        };
      }
      userKey = userProvidedKey;
    } else {
      console.log('🔑 Generating new key');
      // Generate new key
      userKey = generateUserEncryptionKey();
      console.log('✅ Key generated successfully');
    }

    console.log('🔒 Encrypting user key with master key...');
    // Encrypt the user key with master key
    const encryptedUserKey = encryptWithMasterKey(userKey);
    console.log('✅ User key encrypted');

    console.log('💾 Updating database...');
    // Update auth_users table
    const result = await db
      .update(authUsers)
      .set({
        encryptionType,
        encryptionKey: encryptedUserKey,
        updatedAt: new Date(),
      })
      .where(eq(authUsers.id, authUserId))
      .returning();

    if (!result || result.length === 0) {
      console.error('❌ No rows updated - user not found');
      return {
        ok: false,
        error: 'User not found',
      };
    }

    console.log('✅ Database updated successfully');
    return {
      ok: true,
      message: 'Encryption setup successful',
    };
  } catch (error) {
    console.error('❌ Setup encryption error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to setup encryption',
    };
  }
}