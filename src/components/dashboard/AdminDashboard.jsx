import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../shared/Button";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [userCreationError, setUserCreationError] = useState("");
  const [userCreationSuccess, setUserCreationSuccess] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/metrics/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setUserCreationError("");
    setUserCreationSuccess("");

    if (userForm.password !== userForm.confirmPassword) {
      setUserCreationError("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/users", userForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserCreationSuccess("User successfully created!");
      setUserForm({ username: "", email: "", password: "", confirmPassword: "", role: "USER" });
    } catch (err) {
      setUserCreationError(err.response?.data?.message || "Failed to create user.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          Admin Dashboard
        </h1>


        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <Button onClick={() => navigate("/admin/users")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
            Manage Users
          </Button>
          <Button onClick={() => navigate("/admin/projects")} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
            Manage Projects
          </Button>
          <Button onClick={() => navigate("/admin/timesheets")} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
            Manage Timesheets
          </Button>
        </div>


<div className="bg-white shadow-lg rounded-xl p-8 mb-12 max-w-3xl mx-auto">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create New User</h2>


  {userCreationError && <p className="text-red-500 text-sm mb-4 text-center">{userCreationError}</p>}
  {userCreationSuccess && <p className="text-green-500 text-sm mb-4 text-center">{userCreationSuccess}</p>}

  <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div>
      <label className="block text-sm font-medium text-gray-700">Username</label>
      <input 
        type="text" 
        name="username" 
        className="input-field" 
        value={userForm.username} 
        onChange={handleUserChange} 
        required 
        placeholder="Enter username"
      />
    </div>


    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input 
        type="email" 
        name="email" 
        className="input-field" 
        value={userForm.email} 
        onChange={handleUserChange} 
        required 
        placeholder="Enter email"
      />
    </div>


    <div>
      <label className="block text-sm font-medium text-gray-700">Password</label>
      <input 
        type="password" 
        name="password" 
        className="input-field" 
        value={userForm.password} 
        onChange={handleUserChange} 
        required 
        placeholder="Enter password"
      />
    </div>


    <div>
      <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
      <input 
        type="password" 
        name="confirmPassword" 
        className="input-field" 
        value={userForm.confirmPassword} 
        onChange={handleUserChange} 
        required 
        placeholder="Confirm password"
      />
    </div>


    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700">Role</label>
      <select 
        name="role" 
        className="input-field" 
        value={userForm.role} 
        onChange={handleUserChange}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>


    <button type="submit" className="w-full md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
      Create User
    </button>
  </form>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: "Active Projects", value: dashboardData.activeProjects },
            { title: "Total Resources", value: dashboardData.totalResources },
            { title: "Total Billed Hours", value: dashboardData.totalBilledHours },
            { title: "Avg Utilization", value: `${dashboardData.averageUtilization}%` },
          ].map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center transform transition-transform hover:scale-105 hover:shadow-xl duration-300">
              <h3 className="text-lg font-semibold text-gray-700">{item.title}</h3>
              <p className="text-3xl font-bold text-blue-600">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;