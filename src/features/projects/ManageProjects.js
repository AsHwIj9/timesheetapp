import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, createProject, assignUsersToProject} from "./projectSlice.js";

const ManageProjects = () => {
  const dispatch = useDispatch();
  const { projects, isLoading, error } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    assignedUsers: [],
    totalBudgetHours: "",
    totalBilledHours: "",
  });

  const [assignData, setAssignData] = useState({
    projectId: "",
    userIds: "",
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        d.setHours(0, 0, 0);
        return d.toISOString();
      };
  
      const newProject = {
        name: formData.name,
        description: formData.description,
        startDate: formatDate(formData.startDate),
        endDate: formatDate(formData.endDate),
        status: formData.status,
        assignedUsers: formData.assignedUsers
          ? formData.assignedUsers.split(",").map((id) => id.trim())
          : [],
        totalBudgetHours: formData.totalBudgetHours ? Number(formData.totalBudgetHours) : 0,
        totalBilledHours: formData.totalBilledHours ? Number(formData.totalBilledHours) : 0,
      };
  
      console.log("Submitting project:", newProject); // Debugging line
  
      await dispatch(createProject(newProject)).unwrap();
  
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "ACTIVE",
        assignedUsers: [],
        totalBudgetHours: "",
        totalBilledHours: "",
      });
  
      dispatch(fetchProjects());
    } catch (err) {
      console.error("Failed to create project", err);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleAssignUsers = async (e) => {
    e.preventDefault();
    try {
      const assignPayload = {
        projectId: assignData.projectId.trim(), // Ensure it's not empty
        userIds: assignData.userIds.split(",").map((id) => id.trim()),
      };
  
      console.log("Sending payload:", assignPayload); // ✅ Debugging step
  
      await dispatch(assignUsersToProject(assignPayload)).unwrap();
      setAssignData({ projectId: "", userIds: "" });
      dispatch(fetchProjects());
    } catch (err) {
      console.error("Failed to assign users", err);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Projects</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}


      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Projects</h2>
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-50 rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-semibold text-blue-600">{project.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm"><span className="font-medium">Status:</span> {project.status}</p>
                  <p className="text-sm"><span className="font-medium">Start Date:</span> {new Date(project.startDate).toLocaleDateString()}</p>
                  <p className="text-sm"><span className="font-medium">End Date:</span> {new Date(project.endDate).toLocaleDateString()}</p>
                  <p className="text-sm"><span className="font-medium">Budget Hours:</span> {project.totalBudgetHours}</p>
                  <p className="text-sm"><span className="font-medium">Billed Hours:</span> {project.totalBilledHours}</p>
                  <p className="text-sm">
                    <span className="font-medium">Assigned Users:</span>{' '}
                    {project.assignedUsers && project.assignedUsers.length > 0 
                      ? project.assignedUsers.join(", ") 
                      : "No users assigned"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No projects found. Create your first project below.</p>
        )}
      </div>


      <form onSubmit={handleCreateProject} className="bg-gray-100 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="text"
            name="assignedUsers"
            placeholder="User IDs (comma-separated)"
            value={formData.assignedUsers}
            onChange={(e) => setFormData({ ...formData, assignedUsers: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            name="totalBudgetHours"
            placeholder="Total Budget Hours"
            value={formData.totalBudgetHours}
            onChange={(e) => setFormData({ ...formData, totalBudgetHours: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="number"
            name="totalBilledHours"
            placeholder="Total Billed Hours"
            value={formData.totalBilledHours}
            onChange={(e) => setFormData({ ...formData, totalBilledHours: e.target.value })}
            className="input-field"
            required
          />
        </div>
        <button type="submit" className="btn-primary mt-4" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Project'}
        </button>
      </form>


      <form onSubmit={handleAssignUsers} className="bg-gray-100 p-6 mt-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Assign Users to Project</h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="projectId"
            placeholder="Project ID"
            value={assignData.projectId}
            onChange={(e) => setAssignData({ ...assignData, projectId: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="text"
            name="userIds"
            placeholder="User IDs (comma-separated)"
            value={assignData.userIds}
            onChange={(e) => setAssignData({ ...assignData, userIds: e.target.value })}
            className="input-field"
            required
          />
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Assigning...' : 'Assign Users'}
          </button>
        </div>
      </form>

     
      </div>
  );
};

export default ManageProjects;
