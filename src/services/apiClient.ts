import axios from "axios";
import Toast from "react-native-toast-message";

import { env } from "../utils/env";
import { getAccessToken, useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ??
      (typeof error?.message === "string" ? error.message : "Request failed");

    if (status === 401) {
      // For now: hard logout on unauthorized.
      // You can extend this to auto-refresh using /api/auth/refresh.
      await useAuthStore.getState().clear();
    }

    Toast.show({ type: "error", text1: "Error", text2: message });
    return Promise.reject(error);
  }
);

