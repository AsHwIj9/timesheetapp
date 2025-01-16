import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/users" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <h2 className="text-xl font-semibold">Manage Users</h2>
          <p className="mt-2 text-gray-600">Create, update, or delete users.</p>
        </Link>
        <Link to="/projects" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <h2 className="text-xl font-semibold">Manage Projects</h2>
          <p className="mt-2 text-gray-600">View and assign projects to users.</p>
        </Link>
        <Link to="/metrics" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <h2 className="text-xl font-semibold">View Metrics</h2>
          <p className="mt-2 text-gray-600">Analyze performance and productivity.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;