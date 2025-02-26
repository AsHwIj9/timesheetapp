import reducer, {
    fetchProjects,
    createProject,
    assignUsersToProject
  } from "../projectSlice.js";
  import projectService from "../projectService.js";
  import { configureStore } from "@reduxjs/toolkit";
  
  // Mock the projectService methods
  jest.mock("../projectService");
  
  describe("projectSlice", () => {
    let initialState;
  
    beforeEach(() => {
      initialState = {
        projects: [],
        isLoading: false,
        error: null
      };
    });
  
    // ✅ Reducer Tests
    it("should return the initial state", () => {
      expect(reducer(undefined, { type: undefined })).toEqual(initialState);
    });
  
    // ✅ fetchProjects Tests
    it("should handle fetchProjects fulfilled", async () => {
      const projectsData = [{ id: 1, name: "Project A" }];
      projectService.getAllProjects.mockResolvedValueOnce(projectsData);
  
      const store = configureStore({ reducer: reducer });
      await store.dispatch(fetchProjects());
  
      const state = store.getState();
      expect(state.projects).toEqual(projectsData);
      expect(state.isLoading).toBe(false);
    });
  
    it("should handle fetchProjects rejected", async () => {
      projectService.getAllProjects.mockRejectedValueOnce(new Error("Fetch failed"));
  
      const store = configureStore({ reducer: reducer });
      await store.dispatch(fetchProjects());
  
      const state = store.getState();
      expect(state.error).toBe("Fetch failed");
      expect(state.isLoading).toBe(false);
    });
  
    // ✅ createProject Tests
    it("should handle createProject fulfilled", async () => {
      const newProject = { id: 2, name: "New Project" };
      projectService.createProject.mockResolvedValueOnce(newProject);
  
      const store = configureStore({ reducer: reducer });
      await store.dispatch(createProject(newProject));
  
      const state = store.getState();
      expect(state.projects).toContainEqual(newProject);
      expect(state.isLoading).toBe(false);
    });
  
    it("should handle createProject rejected", async () => {
      projectService.createProject.mockRejectedValueOnce(new Error("Creation failed"));
  
      const store = configureStore({ reducer: reducer });
      await store.dispatch(createProject({ name: "Fail Project" }));
  
      const state = store.getState();
      expect(state.error).toBe("Creation failed");
      expect(state.isLoading).toBe(false);
    });
  
    // ✅ assignUsersToProject Tests
    it("should handle assignUsersToProject fulfilled", async () => {
      const existingProject = { id: 1, name: "Project A", assignedUsers: [] };
      const updatedProject = { id: 1, name: "Project A", assignedUsers: ["User1"] };
  
      projectService.assignUsersToProject.mockResolvedValueOnce(updatedProject);
  
      const store = configureStore({
        reducer: reducer,
        preloadedState: {
          projects: [existingProject],
          isLoading: false,
          error: null
        }
      });
  
      await store.dispatch(assignUsersToProject({ projectId: 1, userIds: ["User1"] }));
  
      const state = store.getState();
      expect(state.projects[0].assignedUsers).toEqual(["User1"]);
      expect(state.isLoading).toBe(false);
    });
  
    it("should handle assignUsersToProject rejected", async () => {
      projectService.assignUsersToProject.mockRejectedValueOnce(new Error("Assignment failed"));
  
      const store = configureStore({ reducer: reducer });
      await store.dispatch(assignUsersToProject({ projectId: 1, userIds: ["User1"] }));
  
      const state = store.getState();
      expect(state.error).toBe("Assignment failed");
      expect(state.isLoading).toBe(false);
    });
  });
