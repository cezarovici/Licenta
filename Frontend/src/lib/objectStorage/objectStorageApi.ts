import { getAuthToken, handleApiError } from "../utils/apiUtils";

const STORAGE_API_BASE_URL = "http://127.0.0.1:3008/api";

interface FileStorageResponse {
  data: { url: string };
  message: string;
  status: number;
}

export const uploadFileToObjectStorage = async (
  file: File
): Promise<FileStorageResponse> => {
  const url = `${STORAGE_API_BASE_URL}/upload`;
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication token not found. Cannot upload file.");
  }
  console.log("Uploading file with token:", token);
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    await handleApiError(response, "file upload to object storage");
  }

  return response.json();
};

export const deleteFileStoragePhoto = async (
  photoUrl: string
): Promise<FileStorageResponse> => {
  const url = `${STORAGE_API_BASE_URL}/delete/${photoUrl}`;

  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication token not found. Cannot upload file.");
  }

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      // NU adăuga 'Content-Type' aici. Browser-ul îl va seta automat
      // corect pentru FormData (cu boundary-ul necesar).
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    await handleApiError(response, "file upload to object storage");
  }

  return response.json();
};
