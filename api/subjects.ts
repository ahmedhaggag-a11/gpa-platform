import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "/api",
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Unknown error";
    throw new Error(`${message} (Status ${error.response?.status || 'Unknown'})`);
  }
);

export const getSubjects = async (): Promise<any[]> => {
  return api.get("/subject");
};

export const getSubjectById = async (id: number): Promise<any> => {
  return api.get(`/subject/${id}`);
};

export const getCirculum = async (): Promise<any> => {
  return api.get("/curriculum");
};