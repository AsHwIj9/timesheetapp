import axios from "axios";
import timesheetService, { getAuthHeaders } from "./timesheetService";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

describe("timesheetService", () => {
  const API_URL = "http://localhost:8080/api/timesheets";
  const mockToken = "mocked-token";
  
  beforeEach(() => {
    localStorage.setItem("token", mockToken);
  });

  afterEach(() => {
    mock.reset();
    localStorage.clear();
  });

  test("getAuthHeaders should return correct headers", () => {
    const headers = getAuthHeaders();
    expect(headers).toEqual({
      Authorization: `Bearer ${mockToken}`,
      "Content-Type": "application/json",
    });
  });

  test("getUserTimesheets should fetch timesheets for a user", async () => {
    const userId = "123";
    const mockResponse = [{ id: 1, totalHours: 40 }];

    mock.onGet(`${API_URL}/users/${userId}`).reply(200, mockResponse);

    const result = await timesheetService.getUserTimesheets(userId);
    expect(result).toEqual(mockResponse);
  });

  test("getTimesheetById should fetch a timesheet by ID", async () => {
    const timesheetId = "456";
    const mockResponse = { id: 456, totalHours: 38 };

    mock.onGet(`${API_URL}/${timesheetId}`).reply(200, mockResponse);

    const result = await timesheetService.getTimesheetById(timesheetId);
    expect(result).toEqual(mockResponse);
  });

  test("getTimesheetStats should fetch timesheet stats", async () => {
    const mockResponse = { totalSubmittedTimesheets: 5, totalBilledHours: 200 };

    mock.onGet(`${API_URL}/stats/summary`).reply(200, mockResponse);

    const result = await timesheetService.getTimesheetStats();
    expect(result).toEqual(mockResponse);
  });

  test("approveTimesheet should approve a timesheet", async () => {
    const timesheetId = "789";
    const mockResponse = { status: "APPROVED" };

    mock.onPatch(`${API_URL}/${timesheetId}/approve`).reply(200, mockResponse);

    const result = await timesheetService.approveTimesheet(timesheetId);
    expect(result).toEqual(mockResponse);
  });

  test("rejectTimesheet should reject a timesheet with a reason", async () => {
    const timesheetId = "101";
    const rejectionReason = "Incomplete hours";
    const mockResponse = { status: "REJECTED", rejectionReason };

    mock.onPatch(`${API_URL}/${timesheetId}/reject`).reply(200, mockResponse);

    const result = await timesheetService.rejectTimesheet(timesheetId, rejectionReason);
    expect(result).toEqual(mockResponse);
  });

  test("submitTimesheet should submit a new timesheet", async () => {
    const timesheetData = { projectId: "123", totalHours: 40 };
    const mockResponse = { id: "789", ...timesheetData };

    mock.onPost(API_URL).reply(200, mockResponse);

    const result = await timesheetService.submitTimesheet(timesheetData);
    expect(result).toEqual(mockResponse);
  });

  test("getCurrentUserTimesheets should fetch current user timesheets", async () => {
    const mockResponse = [{ id: "202", totalHours: 35 }];

    mock.onGet(`${API_URL}`).reply(200, mockResponse);

    const result = await timesheetService.getCurrentUserTimesheets();
    expect(result).toEqual(mockResponse);
  });

  test("getProjectTimesheets should fetch timesheets by project ID and date range", async () => {
    const projectId = "project123";
    const startDate = "2024-01-01";
    const endDate = "2024-01-31";
    const mockResponse = [{ id: 1, totalHours: 50 }];

    mock
      .onGet(`${API_URL}/projects/${projectId}`, { params: { startDate, endDate } })
      .reply(200, mockResponse);

    const result = await timesheetService.getProjectTimesheets(projectId, startDate, endDate);
    expect(result).toEqual(mockResponse);
  });

  test("should handle 401 error by removing token and redirecting", async () => {
    const userId = "123";

    mock.onGet(`${API_URL}/users/${userId}`).reply(401);

    delete window.location;
    window.location = { href: "" };

    await expect(timesheetService.getUserTimesheets(userId)).rejects.toThrow();
    expect(localStorage.getItem("token")).toBeNull();
    expect(window.location.href).toBe("/login");
  });
});