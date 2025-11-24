'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { downloadAndDecryptFile } from '@/lib/crypto/download';
import { DecryptionPasswordDialog } from '@/components/organisms/forms/decryption-password-dialog';

interface DownloadHandlerProps {
  file: {
    id: string;
    name: string;
    fileName: string;
    encryptedKey?: string | null;
    encryptionIv?: string | null;
    encryptionSalt?: string | null;
    isEncrypted?: boolean;
  };
  fileUrl: string;
  children: (props: { onClick: () => void; isLoading: boolean }) => React.ReactNode;
}

export function DownloadHandler({ file, fileUrl, children }: DownloadHandlerProps) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDownloadClick = () => {
    // Check if file is encrypted
    if (file.isEncrypted && file.encryptedKey && file.encryptionIv) {
      // Show password dialog
      setShowPasswordDialog(true);
    } else {
      // Direct download for non-encrypted files
      handleDirectDownload();
    }
  };

  const handleDirectDownload = async () => {
    try {
      // For encrypted files, get signed URL from API
      if (file.isEncrypted) {
        const response = await fetch(`/api/download/${file.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to get download URL');
        }

        const a = document.createElement('a');
        a.href = data.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Direct download for non-encrypted files
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handlePasswordConfirm = async (password: string) => {
    if (!file.encryptedKey || !file.encryptionIv || !file.encryptionSalt) {
      toast.error('Missing encryption metadata');
      return;
    }

    setIsDecrypting(true);
    setShowPasswordDialog(false);

    try {
      toast.info('Fetching encrypted file...');
      
      // Get signed URL from API
      const response = await fetch(`/api/download/${file.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get download URL');
      }

      toast.info('Decrypting file...');
      
      await downloadAndDecryptFile(
        data.url,
        file.encryptedKey,
        file.encryptionIv,
        password,
        file.encryptionSalt,
        file.name
      );

      toast.success('✅ File decrypted and downloaded successfully!');
    } catch (error) {
      console.error('Decryption error:', error);
      toast.error('❌ Failed to decrypt file. Check your password and try again.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordDialog(false);
  };

  return (
    <>
      <DecryptionPasswordDialog
        isOpen={showPasswordDialog}
        onConfirm={handlePasswordConfirm}
        onCancel={handlePasswordCancel}
        fileName={file.name}
      />
      {children({ onClick: handleDownloadClick, isLoading: isDecrypting })}
    </>
  );
}