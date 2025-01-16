// src/context/authContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);

        const currentTime = Date.now() / 1000;
        if (decodedUser.exp < currentTime) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser({ email: decodedUser.email, name: decodedUser.name });
        }
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  const loginProvider = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loginProvider, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
