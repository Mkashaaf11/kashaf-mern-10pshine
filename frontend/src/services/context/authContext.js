import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode"; // Removed curly braces around jwtDecode
import { useNavigate } from "react-router-dom";
import API from "../axiosInstance";
import { getUser } from "../userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
    navigate("/auth/login");
  }, [navigate]);

  const fetchUserData = useCallback(
    async (userId) => {
      try {
        const userData = await getUser(userId);

        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    },
    [handleLogout]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        console.log("Decoded token:", decoded);

        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          handleLogout();
        } else {
          fetchUserData(decoded.id);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        handleLogout();
      }
    } else {
      setLoading(false);
    }

    const responseInterceptor = API.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.response.eject(responseInterceptor);
    };
  }, [fetchUserData, handleLogout]);

  const loginProvider = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
    setLoading(false);
  };

  const logout = () => {
    handleLogout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginProvider, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
