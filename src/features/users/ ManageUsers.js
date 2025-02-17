import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUserById, fetchUserStats, fetchUserById } from "../../features/users/userSlice";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold flex justify-between">
        Manage Users
        {/* Search Bar for User ID */}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search by User ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleSearchUser}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </h1>

      {isLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Searched User */}
      {searchedUser && (
        <div className="mt-4 bg-yellow-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Searched User</h2>
          <p><strong>ID:</strong> {searchedUser.id}</p>
          <p><strong>Username:</strong> {searchedUser.username}</p>
          <p><strong>Role:</strong> {searchedUser.role}</p>
        </div>
      )}

      {/* User List */}
      <ul className="mt-4">
        {users.map((user) => (
          <li key={user.id} className="border p-2 flex justify-between">
            {user.username} - {user.role}
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDeleteUser(user.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Date Picker for Stats */}
      <div className="bg-gray-100 p-4 mt-6">
        <h2 className="text-lg font-semibold">View User Stats</h2>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 w-full mt-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 w-full mt-2"
        />
        <button
          onClick={handleFetchStats}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        >
          Fetch Stats
        </button>
      </div>

      {/* Display User Stats */}
      {userStats && (
        <div className="mt-4 bg-gray-200 p-4">
          <h2 className="text-lg font-semibold">User Stats</h2>
          <pre>{JSON.stringify(userStats, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;