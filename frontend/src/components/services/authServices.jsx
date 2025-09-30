// src/services/authService.js
import api from "../../api/api";

// Login
export const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
    return { success: true, user: res.data.user };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || "Login failed" };
  }
};

// Signup
export const signup = async (formData) => {
  try {
    const res = await api.post("/auth/signup", formData, { withCredentials: true });
    return { success: true, user: res.data.user };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || "Signup failed" };
  }
};

// Logout
export const logout = async () => {
  try {
    await api.post("/auth/logout", {}, { withCredentials: true });
    return { success: true };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || "Logout failed" };
  }
};
