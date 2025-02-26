import axios from "axios";

const BASE_URL = "http://localhost:8080/api";


const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const handleApiError = (error, operation) => {
  console.error(`Error in ${operation}:`, error.response?.data || error.message);
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  throw error;
};

const projectService = {
  
  getAllProjects: async () => {
    try {
      const response = await API.get('/projects');
      console.log("Fetched Projects:", response.data);
      return response.data.map(project => ({
        ...project,
        assignedUsers: project.assignedUsers.length ? project.assignedUsers : ["No Users Assigned"],
        totalBilledHours: project.totalBilledHours || 0,
      }));
    } catch (error) {
      handleApiError(error, 'getAllProjects');
    }
  },

  
  createProject: async (projectData) => {
    try {
      const response = await API.post('/projects', projectData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'createProject');
    }
  },

 
  assignUsersToProject: async (projectId, userIds) => {
    try {
      console.log("API Request Payload:", { projectId, userIds }); // ✅ Debugging step
  
      const response = await API.post(`/projects/${projectId}/users`, { projectId, userIds });
  
      console.log("Users assigned successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error assigning users:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default projectService;
