'use client';

import { useState } from 'react';
import { Button, Password, Text } from 'rizzui';
import { Box } from '@/components/atoms/layout';

interface DecryptionPasswordDialogProps {
  onConfirm: (password: string) => void;
  onCancel: () => void;
  isOpen: boolean;
  fileName?: string;
}

export function DecryptionPasswordDialog({
  onConfirm,
  onCancel,
  isOpen,
  fileName,
}: DecryptionPasswordDialogProps) {
  const [password, setPassword] = useState('');
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

    onConfirm(password);
    setPassword('');
    setError('');
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onCancel();
  };

  return (
    <Box className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Box className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">🔐 Decrypt File</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Enter the password you used to encrypt this file.
        </p>

        {fileName && (
          <Box className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <Text className="text-sm font-medium">{fileName}</Text>
          </Box>
        )}

        <Box className="space-y-4">
          <Password
            label="Decryption Password"
            placeholder="Enter your encryption password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleConfirm();
              }
            }}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Box className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
            >
              Decrypt & Download
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}