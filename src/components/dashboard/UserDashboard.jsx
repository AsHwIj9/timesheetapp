import React from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/timesheets" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <h2 className="text-xl font-semibold">Manage Timesheets</h2>
          <p className="mt-2 text-gray-600">Submit and view your timesheets.</p>
        </Link>
        <Link to="/projects/assigned" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <h2 className="text-xl font-semibold">View Assigned Projects</h2>
          <p className="mt-2 text-gray-600">Check the projects assigned to you.</p>
        </Link>
        <Link to="/profile" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-2 text-gray-600">Update your profile details.</p>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
