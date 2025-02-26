import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/dashboard/AdminDashboard.jsx";
import UserDashboard from "./components/dashboard/UserDashboard.jsx";
import Login from "./components/auth/Login.jsx";
import ManageUsers from "./features/users/ManageUsers.js";
import ManageProjects from "./features/projects/ManageProjects.js";
import ManageTimesheets from "./features/timesheets/ManageTimesheets.js";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";

const App = () => {
  return (
    <div className="App">
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" />} />

       
        <Route path="/login" element={<Login />} />

        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/timesheets"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageTimesheets />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;