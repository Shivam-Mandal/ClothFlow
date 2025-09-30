// src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginForm } from "./components/auth/LoginForm";
import AdminDashboard, {Overview} from "./components/admin/AdminDashboard";
import {StyleManagement} from './components/admin/StyleManagement.jsx'
import {StockManagement} from './components/admin/StockManagement.jsx'
import {OrderManagement} from './components/admin/OrderManagement.jsx'
import {ProcessTracking} from './components/admin/ProcessTracking.jsx'
import {WorkerManagement} from './components/admin/WorkerManagement.jsx'
import {WorkerPerformance} from './components/admin/WorkerPerformance.jsx'
import {Reports} from './components/admin/Reports.jsx'
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

          {/* Protected layout route: AdminDashboard acts as the layout (renders Sidebar, Topbar, Outlet). */}
          <Route
            element={
              !user ? (
                <Navigate to="/" replace />
              ) : user.role === "admin" ? (
                <AdminDashboard user={user} onLogout={logout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          >
            {/* child routes - these are top-level paths (no /dashboard prefix) */}
            <Route path="dashboard" element={<Overview />} />
            <Route path="styles" element={<StyleManagement />} />
            <Route path="stock" element={<StockManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="processes" element={<ProcessTracking />} />
            <Route path="manage-worker" element={<WorkerManagement />} />
            <Route path="workers" element={<WorkerPerformance />} />
            <Route path="reports" element={<Reports />} />

            {/* optional: visiting / inside protected area redirect to /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>

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
