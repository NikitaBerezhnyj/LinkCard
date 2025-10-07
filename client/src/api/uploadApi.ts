import axios from "axios";

const API_URL = "http://192.168.0.106:3001/api";

interface UploadResponse {
  message: string;
  filePath: string;
}

export const uploadAvatar = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post<UploadResponse>(`${API_URL}/upload-avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};

export const uploadBackground = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post<UploadResponse>(`${API_URL}/upload-background`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};
