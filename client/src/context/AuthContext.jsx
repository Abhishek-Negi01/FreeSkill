import { createContext, useEffect, useState } from "react";
import api from "../api/axios.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/users/me");
      setUser(data.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/users/login", credentials);
      setUser(data.data.user);
    } catch (error) {
      setUser(null);
    }
  };

  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
  };

  const register = async (userInfo) => {
    await api.post("/users/register", userInfo);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, checkAuth, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
