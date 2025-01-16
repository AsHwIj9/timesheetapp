import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="bg-gray-800 text-white w-64 h-full p-4">
      <h2 className="text-lg font-bold mb-6">Menu</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
        {user?.role === "ADMIN" && (
          <>
            <li className="mb-4">
              <Link to="/users" className="hover:underline">
                User Management
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/projects" className="hover:underline">
                Project Management
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/timesheets" className="hover:underline">
            Timesheets
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;