// src/lib/api.ts
const API_BASE_URL = "http://localhost:8000";

export const api = {
  async general(question: string) {
    const response = await fetch(`${API_BASE_URL}/general`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) throw new Error("API request failed");
    return response.json();
  },

  async askFile(question: string) {
    const response = await fetch(`${API_BASE_URL}/ask-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) throw new Error("API request failed");
    return response.json();
  },

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/upload-file`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("File upload failed");
    return response.json();
  },

  async uploadSyllabus(syllabus: string) {
    const response = await fetch(`${API_BASE_URL}/upload-syllabus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ syllabus }),
    });
    if (!response.ok) throw new Error("Syllabus upload failed");
    return response.json();
  },

  async syllabus(question: string) {
    const response = await fetch(`${API_BASE_URL}/syllabus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) throw new Error("Syllabus query failed");
    return response.json();
  },
};
