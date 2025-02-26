import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import UserDashboard from "../../components/dashboard/UserDashboard";
import { submitTimesheet } from "../../../features/timesheets/timesheetSlice";


jest.mock("axios");

jest.mock("../../../features/timesheets/timesheetSlice", () => ({
  submitTimesheet: jest.fn()
}));


const mockAuthReducer = (state = { user: { id: "user1", name: "Test User", role: "USER" } }) => state;
const mockTimesheetsReducer = (state = { isLoading: false, error: null }) => state;

describe("UserDashboard Component", () => {

  const mockProjects = [
    { id: "project1", name: "Project Alpha" },
    { id: "project2", name: "Project Beta" }
  ];

  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "mock-token"),
        setItem: jest.fn()
      },
      writable: true
    });
    

    store = configureStore({
      reducer: {
        auth: mockAuthReducer,
        timesheets: mockTimesheetsReducer
      }
    });
    

    axios.get.mockResolvedValue({ data: mockProjects });
    

    submitTimesheet.mockImplementation((data) => {
      return {
        type: "timesheets/submitTimesheet",
        payload: data,
        unwrap: jest.fn().mockResolvedValue({})
      };
    });
  });

  test("renders the UserDashboard component", async () => {
    render(
      <Provider store={store}>
        <UserDashboard />
      </Provider>
    );
    
    expect(screen.getByText("Hello, User!")).toBeInTheDocument();
    expect(screen.getByText("Submit Timesheet")).toBeInTheDocument();
    

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/projects",
      { headers: { Authorization: "Bearer mock-token" } }
    );
    

    await waitFor(() => {
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
      expect(screen.getByText("Project Beta")).toBeInTheDocument();
    });
  });

  test("displays loading state", async () => {

    const loadingStore = configureStore({
      reducer: {
        auth: mockAuthReducer,
        timesheets: () => ({ isLoading: true, error: null })
      }
    });
    
    render(
      <Provider store={loadingStore}>
        <UserDashboard />
      </Provider>
    );
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error message", async () => {

    const errorStore = configureStore({
      reducer: {
        auth: mockAuthReducer,
        timesheets: () => ({ isLoading: false, error: "Test error message" })
      }
    });
    
    render(
      <Provider store={errorStore}>
        <UserDashboard />
      </Provider>
    );
    
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  test("handles form input changes correctly", async () => {
    render(
      <Provider store={store}>
        <UserDashboard />
      </Provider>
    );
    

    await waitFor(() => {
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    });
    

    const projectSelect = screen.getByRole("combobox");
    userEvent.selectOptions(projectSelect, "project1");
    expect(projectSelect).toHaveValue("project1");
    

    const dateInput = screen.getByRole("textbox", { type: "date" });
    fireEvent.change(dateInput, { target: { value: "2025-02-20" } });
    expect(dateInput).toHaveValue("2025-02-20");
    

    const mondayInput = screen.getAllByRole("spinbutton")[0]; // MONDAY is first
    userEvent.clear(mondayInput);
    userEvent.type(mondayInput, "6");
    expect(mondayInput).toHaveValue(6);
    

    const descriptionInput = screen.getByRole("textbox", { name: "" }); // The textarea
    userEvent.type(descriptionInput, "Test description");
    expect(descriptionInput).toHaveValue("Test description");
  });

  test("prevents non-USER roles from submitting timesheets", async () => {

    const nonUserStore = configureStore({
      reducer: {
        auth: () => ({ user: { id: "user1", name: "Test User", role: "ADMIN" } }),
        timesheets: mockTimesheetsReducer
      }
    });
    
    render(
      <Provider store={nonUserStore}>
        <UserDashboard />
      </Provider>
    );
    

    await waitFor(() => {
      expect(screen.getByText("Submit Timesheet")).toBeInTheDocument();
    });
    

    const submitButton = screen.getByRole("button", { name: "Submit Timesheet" });
    fireEvent.click(submitButton);
    

    expect(screen.getByText("Only users can submit timesheets.")).toBeInTheDocument();
    

    expect(submitTimesheet).not.toHaveBeenCalled();
  });

  test("successfully submits a timesheet", async () => {

    const mockUnwrap = jest.fn().mockResolvedValue({});
    submitTimesheet.mockReturnValue({
      type: "timesheets/submitTimesheet",
      payload: {},
      unwrap: mockUnwrap
    });
    
    render(
      <Provider store={store}>
        <UserDashboard />
      </Provider>
    );
    

    await waitFor(() => {
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    });
    

    userEvent.selectOptions(screen.getByRole("combobox"), "project1");
    fireEvent.change(screen.getByRole("textbox", { type: "date" }), {
      target: { value: "2025-02-20" }
    });
    userEvent.type(screen.getByRole("textbox", { name: "" }), "Test description");
    

    fireEvent.click(screen.getByRole("button", { name: "Submit Timesheet" }));
    

    expect(submitTimesheet).toHaveBeenCalledWith({
      userId: "abc",
      projectId: "project1",
      weekStartDate: "2025-02-20",
      dailyHours: { MONDAY: 8, TUESDAY: 8, WEDNESDAY: 8, THURSDAY: 8, FRIDAY: 8, SATURDAY: 0, SUNDAY: 0 },
      description: "Test description",
      status: "SUBMITTED"
    });
    

    expect(mockUnwrap).toHaveBeenCalled();
    

    await waitFor(() => {
      expect(screen.getByText("Timesheet submitted successfully!")).toBeInTheDocument();
    });
  });

  test("handles timesheet submission error", async () => {

    const mockError = new Error("Submission failed");
    mockError.message = "Submission failed";
    
    const mockUnwrap = jest.fn().mockRejectedValue(mockError);
    submitTimesheet.mockReturnValue({
      type: "timesheets/submitTimesheet",
      payload: {},
      unwrap: mockUnwrap
    });
    
    render(
      <Provider store={store}>
        <UserDashboard />
      </Provider>
    );
    

    await waitFor(() => {
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    });
    

    userEvent.selectOptions(screen.getByRole("combobox"), "project1");
    fireEvent.change(screen.getByRole("textbox", { type: "date" }), {
      target: { value: "2025-02-20" }
    });
    userEvent.type(screen.getByRole("textbox", { name: "" }), "Test description");
    

    fireEvent.click(screen.getByRole("button", { name: "Submit Timesheet" }));
    

    await waitFor(() => {
      expect(screen.getByText("Submission failed")).toBeInTheDocument();
    });
  });

  test("handles API error when fetching projects", async () => {

    console.error = jest.fn(); // Suppress console.error in test
    axios.get.mockRejectedValueOnce(new Error("Network error"));
    
    render(
      <Provider store={store}>
        <UserDashboard />
      </Provider>
    );
    

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/projects",
      { headers: { Authorization: "Bearer mock-token" } }
    );
    

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});