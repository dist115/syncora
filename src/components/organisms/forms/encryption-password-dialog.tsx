'use client';

import { useState } from 'react';
import { Button, Input, Password } from 'rizzui';
import { Box } from '@/components/atoms/layout';

interface EncryptionPasswordDialogProps {
  onConfirm: (password: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function EncryptionPasswordDialog({
  onConfirm,
  onCancel,
  isOpen,
}: EncryptionPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onConfirm(password);
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <Box className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Box className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Encrypt Your Files</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Your files will be encrypted using end-to-end encryption. 
          Only you can access them with this password.
        </p>

        <Box className="space-y-4">
          <Password
            label="Encryption Password"
            placeholder="Enter encryption password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
          />

          <Password
            label="Confirm Password"
            placeholder="Confirm encryption password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Box className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
            >
              Encrypt & Upload
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
