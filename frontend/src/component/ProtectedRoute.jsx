import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../services/context/authContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.email) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default ProtectedRoute;
