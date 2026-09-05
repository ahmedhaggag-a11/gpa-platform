import axios from "axios";
import {  getAccessToken } from "./config";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "/api",
});

// Add request interceptor to include authorization header
api.interceptors.request.use(async (config) => {
  const access_token = await getAccessToken();
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Unknown error";
    throw new Error(
      `${message} (Status ${error.response?.status || "Unknown"})`
    );
  }
);

export const getTeachers = async (
  subjectId?: number,
  classId?: number
): Promise<any[]> => {
  let url = "/teacher";
  const queryParams: string[] = [];

  if (subjectId !== undefined) queryParams.push(`subjectId=${subjectId}`);
  if (classId !== undefined) queryParams.push(`classId=${classId}`);

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }
  return api.get(url);
};


export const getTeacherById = async (id: number): Promise<any> => {
  return api.get(`/teacher/${id}/for-student`);
};