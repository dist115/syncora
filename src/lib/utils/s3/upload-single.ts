import { API } from '@/config/api';
import { MESSAGES } from '@/config/messages';
import { handleErrorMessage } from '../error';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';

/**
 * Uploads a single file using server-side encryption (POST method)
 * No client-side encryption needed - server handles everything
 * 
 * @param file - The file to upload
 * @param progressHandler - Optional callback for upload progress
 * @returns The S3 key of the uploaded file
 */
export const uploadSingleFile = async (
  file: File,
  progressHandler?: (prog: number, signal?: AbortController) => void
) => {
  try {
    // Create FormData with the file
    const formData = new FormData();
    formData.append('file', file);

    // Upload to server (server will encrypt and upload to R2)
    const controller = new AbortController();
    const config: AxiosRequestConfig = {
      signal: controller.signal,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: function (progressEvent: AxiosProgressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total as number)
        );
        if (progressHandler) {
          progressHandler(percentCompleted, controller);
        }
      },
    };

    const response = await axios.post(API.UPLOAD_URL, formData, config);

    // Return the key from server response
    return response.data.key;
  } catch (error) {
    handleErrorMessage(error, MESSAGES.ERROR_WHILE_UPLOADING_IMAGE);
    throw error;
  }
};