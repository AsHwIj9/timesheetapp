import axios from "axios";
import userService from "./userService";
import { getAuthHeaders } from "../timesheets/timesheetService";


jest.mock("axios");
jest.mock("../timesheets/timesheetService", () => ({
  getAuthHeaders: jest.fn(() => ({ Authorization: "Bearer mockToken" })),
}));

describe("userService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAllUsers - should fetch all users", async () => {
    const mockUsers = [
      { id: "1", username: "John Doe", role: "Manager" },
      { id: "2", username: "Jane Smith", role: "Employee" },
    ];

    axios.get.mockResolvedValueOnce({ data: mockUsers });

    const users = await userService.getAllUsers();

    expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/api/users", {
      headers: { Authorization: "Bearer mockToken" },
    });
    expect(users).toEqual(mockUsers);
  });

  test("getUserById - should fetch user by ID", async () => {
    const mockUser = { id: "1", username: "John Doe", role: "Manager" };

    axios.get.mockResolvedValueOnce({ data: mockUser });

    const user = await userService.getUserById("1");

    expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/api/users/1", {
      headers: { Authorization: "Bearer mockToken" },
    });
    expect(user).toEqual(mockUser);
  });

  test("getUserStats - should fetch user stats for a given date range", async () => {
    const mockStats = [
      { week: "2024-02-01", hoursWorked: 40 },
      { week: "2024-02-08", hoursWorked: 35 },
    ];

    axios.get.mockResolvedValueOnce({ data: mockStats });

    const stats = await userService.getUserStats("2024-02-01", "2024-02-08");

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/users/stats/weekly",
      {
        headers: { Authorization: "Bearer mockToken" },
        params: { startDate: "2024-02-01", endDate: "2024-02-08" },
      }
    );
    expect(stats).toEqual(mockStats);
  });

  test("deleteUser - should delete a user by ID", async () => {
    axios.delete.mockResolvedValueOnce({});

    await userService.deleteUser("1");

    expect(axios.delete).toHaveBeenCalledWith("http://localhost:8080/api/users/1", {
      headers: { Authorization: "Bearer mockToken" },
    });
  });

  test("getAllUsers - should handle errors", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch users"));

    await expect(userService.getAllUsers()).rejects.toThrow("Failed to fetch users");
  });
});