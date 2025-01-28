import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState("");

  const projects = [
    { id: "1", name: "Project Alpha" },
    { id: "2", name: "Project Beta" },
    { id: "3", name: "Project Gamma" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
          User Dashboard
        </h1>

        {/* Select Project Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Select a Project
          </h2>
          <div>
            <label
              htmlFor="project"
              className="block text-sm font-medium text-gray-500 mb-2"
            >
              Choose a project:
            </label>
            <select
              id="project"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                -- Select a Project --
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Submit Timesheet
            </h2>
            <p className="text-gray-500 mb-6">
              Enter your weekly timesheet for the selected project.
            </p>
            <Button
              text="Submit Timesheet"
              onClick={() => navigate("/user/timesheets")}
              className="w-full"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              View Personal Stats
            </h2>
            <p className="text-gray-500 mb-6">
              Track your hours and view performance metrics.
            </p>
            <Button
              text="View Personal Stats"
              onClick={() => navigate("/user/stats")}
              className="w-full"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              View Project Stats
            </h2>
            <p className="text-gray-500 mb-6">
              Analyze the performance metrics for the selected project.
            </p>
            <Button
              text="View Project Stats"
              onClick={() => navigate(`/projects/stats/${selectedProject}`)}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;