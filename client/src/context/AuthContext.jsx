// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
// import { server } from "../server";
const server = import.meta.env.VITE_SERVER_URL;

// 1. Create context
export const AuthContext = createContext();

// 2. Create provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Update sessionStorage whenever user changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  // Logout function
  const logout = async () => {
    try {
      await axios.post(
        `${server}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      // console.error("Logout error:", error);
    } finally {
      // Clear user state and sessionStorage
      setUser(null);
      sessionStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
