import API from "../../utils/api";

// Get all projects
const getAllProjects = async () => {
  const response = await API.get("/projects");
  return response.data;
};

// Get project by ID
const getProjectById = async (projectId) => {
  const response = await API.get(`/projects/${projectId}`);
  return response.data;
};

// Create a new project
const createProject = async (projectData) => {
  const response = await API.post("/projects", projectData);
  return response.data;
};

// Update project by ID
const updateProject = async (projectId, projectData) => {
  const response = await API.put(`/projects/${projectId}`, projectData);
  return response.data;
};

// Delete project by ID
const deleteProject = async (projectId) => {
  const response = await API.delete(`/projects/${projectId}`);
  return response.data;
};

const projectService = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

export default projectService;
