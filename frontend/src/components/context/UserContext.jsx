import React, { createContext, useState, useEffect } from "react";
import api from "../../api/api"; // axios instance with { withCredentials: true }

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, try to get user info from backend (cookie contains JWT)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me"); // backend should read JWT from cookie
        setUser(res.data.user || null);
      } catch (err) {
        setUser(null);
      }
    })();
  }, []);

  // Login: backend sets JWT cookie
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  // Signup: backend sets JWT cookie
  const signup = async (formData) => {
    try {
      const res = await api.post("/auth/signup", formData, { withCredentials: true });
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Signup failed" };
    }
  };

  // Logout: backend clears JWT cookie
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Logout failed" };
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
