import axios from "axios";
import {  getAccessToken } from "./config";

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
    console.log(error);
    const message = error.response?.data?.message || "Unknown error";
    throw new Error(
      `${message} (Status ${error.response?.status || "Unknown"})`
    );
  }
);

export const createEnrollment = async (data: any): Promise<any> => {
  console.log(data)
  return api.post("/enrollment", data);
};

export const isApplicable = async (data: any) => {
  return api.get(
    `/promo-code/is-applicable?code=${data.code}&courseId=${data.courseId}`
  );
};
