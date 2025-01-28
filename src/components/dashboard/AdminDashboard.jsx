import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Admin Dashboard
        </h1>

        {/* Admin Operations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Create Project
            </h2>
            <p className="text-gray-500 mb-6">
              Add new project details and set the project status.
            </p>
            <Button
              text="Create Project"
              onClick={() => navigate("/admin/projects/create")}
              className="w-full"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Manage Resources
            </h2>
            <p className="text-gray-500 mb-6">
              Add or remove resources and tag them to projects.
            </p>
            <Button
              text="Manage Resources"
              onClick={() => navigate("/admin/resources")}
              className="w-full"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              View Statistics
            </h2>
            <p className="text-gray-500 mb-6">
              View project statistics and resource usage.
            </p>
            <Button
              text="View Statistics"
              onClick={() => navigate("/admin/statistics")}
              className="w-full"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Publish Metrics
            </h2>
            <p className="text-gray-500 mb-6">
              Publish project performance metrics to stakeholders.
            </p>
            <Button
              text="Publish Metrics"
              onClick={() => navigate("/admin/metrics")}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;