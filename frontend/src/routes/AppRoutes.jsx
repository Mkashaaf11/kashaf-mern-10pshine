import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Auth from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import NotesPage from "../pages/NotesPage";
import ErrorPage from "../component/Error/ErrorPage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes/*" element={<NotesPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
