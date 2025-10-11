import { API } from '@/config/api';
import { MESSAGES } from '@/config/messages';

import { handleErrorMessage } from '../error';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';

export const uploadSingleFile = async (
  file: File,
  progressHandler?: (prog: number, signal?: AbortController) => void
) => {
  const fileName = encodeURIComponent(file.name);
  const fileType = encodeURIComponent(file.type);

  try {
    const { url, fields } = await fetch(
      `${API.UPLOAD_URL}?fileName=${fileName}&fileType=${fileType}`
    ).then((res) => res.json());
    const controller = new AbortController();
    const config: AxiosRequestConfig = {
      signal: controller.signal,
      headers: {
        'Content-Type': file.type,
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
    const uploadResponse = await axios.put(url, file, config);

    return fields.key;
  } catch (error) {
    handleErrorMessage(error, MESSAGES.ERROR_WHILE_UPLOADING_IMAGE);
  }
};
