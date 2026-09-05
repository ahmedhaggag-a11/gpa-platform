import axios from "axios";
import { getAccessToken } from "./config";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "/api",
});

// Add request interceptor to include authorization header
api.interceptors.request.use(async (config) => {
  const access_token = await getAccessToken();
  console.log(access_token);
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

export const getCourses = async (
  subjectId?: number,
  classId?: number,
  search?: string
): Promise<any[]> => {
  let url = "/course";
  const queryParams: string[] = [];

  if (subjectId !== undefined) queryParams.push(`subjectId=${subjectId}`);
  if (classId !== undefined) queryParams.push(`classId=${classId}`);
  if (search !== undefined) queryParams.push(`search=${search}`);

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }
  console.log(url);
  return api.get(url);
};

export const getCourseById = async (id: number): Promise<any> => {
  return api.get(`/course/${id}`);
};
export const getLessonById = async (id: number): Promise<any> => {
  return api.get(`/lesson/${id}`);
};

export const getLessonUrls = async (id: number): Promise<any> => {
  return api.get(`/lesson/signed-urls?lessonId=${id}`);
};

export const getLessons = async (courseId: number): Promise<any[]> => {
  return api.get(`/lesson/user?courseId=${courseId}`);
};

export const saveCourse = async (courseId: number): Promise<any[]> => {
  return api.post(`course/${courseId}/save-course`);
};
export const unsaveCourse = async (courseId: number): Promise<any[]> => {
  return api.post(`course/${courseId}/unsave-course`);
};
export const markLessonAsCompleted = async (
  leesonId: number
): Promise<any[]> => {
  return api.post(`/lesson/${leesonId}/mark-as-completed`);
};

export const addReview = (data: any) => {
  return api.post("/testimonial", data);
};
