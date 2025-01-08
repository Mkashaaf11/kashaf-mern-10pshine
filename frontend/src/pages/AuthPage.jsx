import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../component/Auth/Login";
import Signup from "../component/Auth/Signup";
import ResetPassword from "../component/Auth/ResetPassword";

const Auth = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* Redirect to login if no path matches */}
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
};

export default Auth;
