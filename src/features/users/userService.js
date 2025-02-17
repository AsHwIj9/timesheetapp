import axios from "axios";
import {getAuthHeaders} from "../timesheets/timesheetService"


const getAllUsers = async () => {
  const response = await axios.get("http://localhost:8080/api/users", {
    headers: getAuthHeaders(),
  });
  return response.data;
};


const getUserById = async (userId) => {
  const response = await axios.get(`http://localhost:8080/api/users/${userId}`,{
    headers: getAuthHeaders(),
  });
  return response.data;
};


const getUserStats = async (startDate, endDate) => {
  const response = await axios.get("http://localhost:8080/api/users/stats/weekly", {
    headers: getAuthHeaders(),
    params: { startDate, endDate },
  });
  return response.data;
};


const deleteUser = async (userId) => {
  await axios.delete(`http://localhost:8080/api/users/${userId}`);
};

const userService = {
  getAllUsers,
  getUserById,
  getUserStats,
  deleteUser,
};

export default userService;