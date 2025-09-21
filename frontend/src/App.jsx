// src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginForm } from "./components/auth/LoginForm";
import { AdminDashboard } from "./components/admin/AdminDashboard";
// import { WorkerDashboard } from "./components/worker/WorkerDashboard";
import UserContext from "./components/context/UserContext.jsx";

export default function App() {
  const { user, logout } = useContext(UserContext);

  return (
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public login route */}
            <Route
              path="/"
              element={!user ? <LoginForm /> : <Navigate to="/dashboard" replace />}
            />

            {/* Dashboard route - protected */}
            <Route
              path="/dashboard"
              element={
                !user ? (
                  <Navigate to="/" replace />
                ) : user.role === "admin" ? (
                  <AdminDashboard user={user} onLogout={logout} />
                ) : (
                  // <WorkerDashboard user={user} onLogout={logout} />
                  <></>
                )
              }
            />

            {/* fallback */}
            <Route
              path="*"
              element={<Navigate to={user ? "/dashboard" : "/"} replace />}
            />
          </Routes>
        </div>
      </BrowserRouter>
  );
}
