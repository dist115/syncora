import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { randomBytes } from 'crypto';

export const mfaUtils = {
  /**
   * Generate MFA secret
   */
  generateSecret: (email: string) => {
    return speakeasy.generateSecret({
      name: `Syncora (${email})`,
      length: 32,
    });
  },

  /**
   * Generate QR code for MFA setup
   */
  generateQRCode: async (otpauthUrl: string): Promise<string> => {
    return QRCode.toDataURL(otpauthUrl);
  },

  /**
   * Verify MFA token
   */
  verifyToken: (token: string, secret: string): boolean => {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2,
    });
  },

  /**
   * Generate backup codes
   */
  generateBackupCodes: (count: number = 10): string[] => {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
  },

  /**
   * Hash backup codes for storage
   */
  hashBackupCodes: async (codes: string[]): Promise<string[]> => {
    const bcrypt = require('bcryptjs');
    return Promise.all(codes.map(code => bcrypt.hash(code, 10)));
  },

  /**
   * Verify backup code
   */
  verifyBackupCode: async (
    code: string,
    hashedCodes: string[]
  ): Promise<{ isValid: boolean; codeIndex: number }> => {
    const bcrypt = require('bcryptjs');
    for (let i = 0; i < hashedCodes.length; i++) {
      const isValid = await bcrypt.compare(code, hashedCodes[i]);
      if (isValid) {
        return { isValid: true, codeIndex: i };
      }
    }
    return { isValid: false, codeIndex: -1 };
  },
};