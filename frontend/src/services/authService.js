// src/services/authService.js
import API from "./axiosInstance";

export const login = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data;
};

export const signup = async (name, email, password) => {
  const response = await API.post("/auth/signup", { name, email, password });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await API.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await API.post(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};
