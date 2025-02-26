import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import projectService from "../projectService.js";

describe("projectService", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("getAllProjects", () => {
    it("should fetch all projects and format them correctly", async () => {
      const mockData = [
        {
          id: 1,
          name: "Project A",
          assignedUsers: ["User1", "User2"],
          totalBilledHours: 10
        },
        {
          id: 2,
          name: "Project B",
          assignedUsers: [],
          totalBilledHours: null
        }
      ];

      mock.onGet("http://localhost:8080/api/projects").reply(200, mockData);

      const result = await projectService.getAllProjects();

      expect(result).toEqual([
        {
          id: 1,
          name: "Project A",
          assignedUsers: ["User1", "User2"],
          totalBilledHours: 10
        },
        {
          id: 2,
          name: "Project B",
          assignedUsers: ["No Users Assigned"],
          totalBilledHours: 0
        }
      ]);
    });

    it("should handle errors when fetching projects", async () => {
      mock.onGet("http://localhost:8080/api/projects").reply(500, { message: "Internal Server Error" });

      await expect(projectService.getAllProjects()).rejects.toThrow("Request failed with status code 500");
    });
  });

  describe("createProject", () => {
    it("should create a new project successfully", async () => {
      const projectData = {
        name: "New Project",
        description: "A description",
        totalBudgetHours: 100
      };

      const mockResponse = { id: 1, ...projectData };

      mock.onPost("http://localhost:8080/api/projects").reply(201, mockResponse);

      const result = await projectService.createProject(projectData);

      expect(result).toEqual(mockResponse);
    });

    it("should handle errors when creating a project", async () => {
      mock.onPost("http://localhost:8080/api/projects").reply(400, { message: "Bad Request" });

      await expect(projectService.createProject({})).rejects.toThrow("Request failed with status code 400");
    });
  });

  describe("assignUsersToProject", () => {
    it("should assign users to a project successfully", async () => {
      const projectId = 1;
      const userIds = [2, 3];
      const mockResponse = { success: true, message: "Users assigned successfully" };

      mock.onPost(`http://localhost:8080/api/projects/${projectId}/users`).reply(200, mockResponse);

      const result = await projectService.assignUsersToProject(projectId, userIds);

      expect(result).toEqual(mockResponse);
    });

    it("should handle errors when assigning users", async () => {
      const projectId = 1;
      const userIds = [2, 3];

      mock.onPost(`http://localhost:8080/api/projects/${projectId}/users`).reply(404, { message: "Project not found" });

      await expect(projectService.assignUsersToProject(projectId, userIds)).rejects.toThrow("Request failed with status code 404");
    });
  });
});