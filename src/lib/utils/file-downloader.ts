import saveAs from 'file-saver'
import { getDecryptedFileLink } from './file';

// export const fileDownloader = (url: string, name?: string) => {
//     if(!url) return;
//     return saveAs(url, name)
// }

/**
 * ✅ Download decrypted file
 */
export async function fileDownloader(fileId: string, fileName: string) {
  try {
    console.log('📥 Downloading file:', fileName);
    
    // ✅ IMPORTANT: fileId should be the database ID, NOT a URL
    // If fileId is already a URL (starts with /api/file/), use it directly
    // Otherwise, convert it to the decryption endpoint URL
    let url: string;
    
    if (fileId.startsWith('/api/file/')) {
      // Already a URL, use as-is
      url = fileId;
      console.log('Using existing URL:', url);
    } else if (fileId.startsWith('http')) {
      // This is an R2 URL (shouldn't happen, but handle it)
      console.error('⚠️ Received R2 URL instead of file ID:', fileId);
      throw new Error('Invalid file ID - received URL instead of database ID');
    } else {
      // This is a file ID, convert to decryption URL
      url = getDecryptedFileLink(fileId);
      console.log('Generated decryption URL:', url);
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('❌ Download failed:', response.status, response.statusText);
      throw new Error(`Download failed: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    console.log('✅ File downloaded successfully');
  } catch (error) {
    console.error('❌ Download failed:', error);
    throw error;
  }
}