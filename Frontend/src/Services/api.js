import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://doccraft-lu3q.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2 min for large files
});

// Request interceptor — attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("doccraft_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle global errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("doccraft_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── Conversion API ────────────────────────────────────────────────
export const convertFile = async (toolId, files, options = {}, onProgress) => {
  const formData = new FormData();

  if (Array.isArray(files)) {
    files.forEach((f) => formData.append("files", f));
  } else {
    formData.append("file", files);
  }

  Object.entries(options).forEach(([k, v]) => formData.append(k, v));

  const response = await api.post(`/convert/${toolId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob",
    onUploadProgress: (e) => {
      const pct = Math.round((e.loaded * 100) / e.total);
      onProgress?.({ phase: "uploading", percent: pct });
    },
  });

  return response;
};

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// ─── Auth API ──────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  register: (name, email, password) =>
    api.post("/auth/register", { name, email, password }),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),
};

// ─── History API ───────────────────────────────────────────────────
export const historyAPI = {
  getAll: (page = 0, size = 10) =>
    api.get(`/history?page=${page}&size=${size}`),

  deleteById: (id) => api.delete(`/history/${id}`),
};

export default api;