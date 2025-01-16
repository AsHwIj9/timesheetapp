import React from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const DashboardPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
          <p>Select an option from the sidebar to get started.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;