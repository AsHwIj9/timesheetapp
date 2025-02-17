import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.auth);
  
  // Get user from Redux, fallback to localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl">
        You are not authorized to access this page.
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;