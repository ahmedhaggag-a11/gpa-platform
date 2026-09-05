import axios from "axios";
import { getAccessToken } from "./config";
import { supabase } from "@/lib/supabaseClient";

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

export const createUser = async (data: any) => {
  return api.post("/auth/signup", data);
};
export const getUser = async () => {
  return api.get("/user/me");
};
export const checkUser = async (email: string, phoneNumber?: string) => {
  return api.get(
    `/user/check-duplicate?email=${email}&phoneNumber=${phoneNumber}`
  );
};

export const updateMe = async (data: any) => {
  return api.patch("/user/me", data);
};

// export const getUser = async () => {
//   return api.get("/user/me");
// };

export const deleteMe = async () => {
  // 1. Deactivate on your backend
  await api.delete("/user/me");

  // 2. Deactivate in Supabase Auth
  const { error } = await supabase.auth.updateUser({
    data: { status: "inActive" },
  });

  if (error) {
    console.error("Failed to update Supabase user metadata:", error);
    throw new Error("Failed to mark user inactive");
  }

  await supabase.auth.signOut();
};

export const getSavedCourses = (): Promise<any[]> => {
  return api.get("/user/me/saved-courses");
};
export const getEnrolledCourses = (): Promise<any[]> => {
  return api.get("/user/me/enrolled-courses");
};
