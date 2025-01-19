import { Routes, Route } from "react-router-dom";
import Auth from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import NotesPage from "../pages/NotesPage";
import ErrorPage from "../component/Error/ErrorPage";
import Home from "../pages/HomePage";
import ProtectedRoute from "../component/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/*"
        element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default AppRoutes;
