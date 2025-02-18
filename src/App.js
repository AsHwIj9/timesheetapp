import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import UserDashboard from "./components/dashboard/UserDashboard";
import Login from "./components/auth/Login";

import ManageUsers from "./features/users/ ManageUsers"
import ManageProjects from "./features/projects/ ManageProjects"
import ManageTimesheets from "./features/timesheets/ManageTimesheets";
import ProtectedRoute from "./components/shared/ProtectedRoute";

const App = () => {
  return (
    <div className="App">
      <Routes>

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
      </Routes>
    </div>
  );
};

export default App;