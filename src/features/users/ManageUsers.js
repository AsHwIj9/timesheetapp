import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUserById, fetchUserStats, fetchUserById } from "../users/userSlice";
import { 
  Search, 
  UserCircle, 
  Calendar, 
  Trash2, 
  AlertCircle, 
  Loader2,
  Users,
  Activity
} from "lucide-react";
import UserUtilizationStats from './UserUtilizationStats.js';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error, userStats, searchedUser } = useSelector((state) => state.users);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    dispatch(fetchUsers()).catch(error => {
      console.error("Failed to fetch users:", error);
    });
  }, [dispatch]);

  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUserById(userId)).unwrap();
      dispatch(fetchUsers());
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleFetchStats = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    try {
      await dispatch(fetchUserStats({ startDate, endDate })).unwrap();
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleSearchUser = async () => {
    if (!searchId) {
      alert("Please enter a User ID.");
      return;
    }
    try {
      await dispatch(fetchUserById(searchId)).unwrap();
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

 

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Manage Users
        </h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by User ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleSearchUser}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>


      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading users...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center p-4 bg-red-50 text-red-500 rounded-lg">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}


      {searchedUser && (
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            User Details
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">ID</p>
              <p className="font-medium">{searchedUser.id}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">{searchedUser.username}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium">{searchedUser.role}</p>
            </div>
          </div>
        </div>
      )}


      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            User Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleFetchStats}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Fetch Stats
          </button>
        </div>

        {userStats && Array.isArray(userStats) && <UserUtilizationStats data={userStats} />}
      </div>


      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCircle className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
