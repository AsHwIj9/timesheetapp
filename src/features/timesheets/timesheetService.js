import axios from "axios";

const API_URL = "http://localhost:8080/api/timesheets";


export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


const handleApiError = (error, operation) => {
  console.error(`Error in ${operation}:`, error);
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  throw error.response?.data || error.message;
};

const timesheetService = {
  
  getUserTimesheets: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.data) {
        throw new Error('No data received');
      }
      return response.data;
    } catch (error) {
      handleApiError(error, 'getUserTimesheets');
    }
  },

  getTimesheetById: async (timesheetId) => {
    try {
      const response = await axios.get(`${API_URL}/${timesheetId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "getTimesheetById");
    }
  },

  getTimesheetStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/stats/summary`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "getTimesheetStats");
    }
  },

  getProjectTimesheets: async (projectId, startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
      }
      const response = await axios.get(`${API_URL}/projects/${projectId}`, {
        params: { startDate, endDate },
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'getProjectTimesheets');
    }
  },
  
  approveTimesheet: async (timesheetId) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${timesheetId}/approve`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'approveTimesheet');
    }
  },

  
  rejectTimesheet: async (timesheetId, rejectionReason) => {
    try {
      if (!rejectionReason) {
        throw new Error('Rejection reason is required');
      }
      const response = await axios.patch(
        `${API_URL}/${timesheetId}/reject`,
        { rejectionReason },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'rejectTimesheet');
    }
  },

  
  submitTimesheet: async (timesheetData) => {
    try {
      if (!timesheetData) {
        throw new Error('Timesheet data is required');
      }
      const response = await axios.post(
        API_URL,
        timesheetData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'submitTimesheet');
    }
  },

  
  getCurrentUserTimesheets: async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'getCurrentUserTimesheets');
    }
  }
};

export default timesheetService;
