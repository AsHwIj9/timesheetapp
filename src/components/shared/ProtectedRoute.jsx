import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ role, children }) => {
  const auth = useSelector((state) => state.auth);

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role && auth.user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;