import { apiClient } from "@/utils/apiClient";
import { IUploadResponse } from "@/types/IUpload";

export const uploadService = {
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<IUploadResponse, FormData>("/upload-avatar", formData);
  },

  uploadBackground: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<IUploadResponse, FormData>("/upload-background", formData);
  }
};
