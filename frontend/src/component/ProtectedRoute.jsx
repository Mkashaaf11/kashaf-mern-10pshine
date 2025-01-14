// src/component/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../services/context/authContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default ProtectedRoute;
