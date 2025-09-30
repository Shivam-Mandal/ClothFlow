import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../../api/api"; // axios instance with { withCredentials: true }
import * as authService from '../services/authServices'
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
    const result = await authService.login(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const signup = async (formData) => {
    const result = await authService.signup(formData);
    if (result.success) setUser(result.user);
    return result;
  };

  const logout = async () => {
    const result = await authService.logout();
    if (result.success) setUser(null);
    return result;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);

export default UserContext;