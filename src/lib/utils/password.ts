import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const passwordUtils = {
  /**
   * Hash a password
   */
  hash: async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  /**
   * Verify a password against a hash
   */
  verify: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },

  /**
   * Validate password strength
   */
  isStrong: (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }
    return { isValid: true };
  },
};