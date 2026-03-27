import axios from "axios";

// Configure base URL depending on environment, assuming FastAPI runs on 8000 locally
const API_BASE_URL = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UploadResponse {
  message: string;
  filename: string;
  student_id: string;
  [key: string]: any;
}

export interface QueryResponse {
  answer: string;
}

export const uploadSyllabus = async (file: File, studentId: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("student_id", studentId);

  try {
    const response = await api.post("/upload/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading syllabus:", error);
    throw error;
  }
};

export const querySyllabus = async (question: string, studentId: string): Promise<QueryResponse> => {
  try {
    const response = await api.post("/query/syllabus", {
      question,
      student_id: studentId,
    });
    return response.data;
  } catch (error) {
    console.error("Error querying syllabus:", error);
    throw error;
  }
};

export const queryGeneral = async (question: string): Promise<QueryResponse> => {
  try {
    const response = await api.post("/query/general", {
      question,
    });
    return response.data;
  } catch (error) {
    console.error("Error querying general:", error);
    throw error;
  }
};

export interface UploadedFileDto {
  id: string;
  name: string;
  type: "pdf" | "docx" | "image" | "other" | string;
  size: number;
  uploadedAt: string;
}

export const fetchFiles = async (): Promise<UploadedFileDto[]> => {
  try {
    const response = await api.get("/upload/files");
    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};
