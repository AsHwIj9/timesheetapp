import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import ManageTimesheets from "../ManageTimesheets.js";
import * as timesheetSlice from "../../../features/timesheets/timesheetSlice.js";

// Mock store setup
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock("../../../features/timesheets/timesheetSlice", () => ({
  fetchUserTimesheets: jest.fn(),
  fetchProjectTimesheets: jest.fn(),
  fetchTimesheetById: jest.fn(),
  approveTimesheet: jest.fn(),
  rejectTimesheet: jest.fn(),
  fetchTimesheetStats: jest.fn(),
}));

describe("ManageTimesheets Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      timesheets: {
        timesheets: [],
        isLoading: false,
        error: null,
        stats: {
          totalSubmittedTimesheets: 5,
          totalBilledHours: 40,
          hoursPerProject: { "101": 20 },
          hoursPerUser: { "1": 20 },
        },
      },
    });
    store.dispatch = jest.fn();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <ManageTimesheets />
      </Provider>
    );

  test("should render ManageTimesheets component", () => {
    renderComponent();
    expect(screen.getByText("Manage Timesheets")).toBeInTheDocument();
  });

  test("should display stats correctly", () => {
    renderComponent();
    expect(screen.getByText("Total Submitted Timesheets")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Total Hours")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  test("should switch search type to Project ID", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Search by Project ID"));
    expect(screen.getByPlaceholderText("Enter Project ID")).toBeInTheDocument();
  });

  test("should dispatch fetchUserTimesheets action on valid user search", async () => {
    renderComponent();
    fireEvent.click(screen.getByText("Search by User ID"));
    fireEvent.change(screen.getByPlaceholderText("Enter User ID"), { target: { value: "1" } });
    fireEvent.click(screen.getByText("Search Timesheets"));

    await waitFor(() => {
      expect(timesheetSlice.fetchUserTimesheets).toHaveBeenCalledWith("1");
    });
  });

  test("should handle approval action", async () => {
    store = mockStore({
      timesheets: {
        timesheets: [
          {
            id: "ts1",
            projectId: "101",
            totalHours: 8,
            weekStartDate: "2024-02-12",
            submittedAt: "2024-02-18",
            status: "SUBMITTED",
          },
        ],
        isLoading: false,
        error: null,
        stats: {},
      },
    });

    renderComponent();

    fireEvent.click(screen.getByText("Approve"));
    expect(timesheetSlice.approveTimesheet).toHaveBeenCalled();
  });

  test("should handle rejection action with reason", async () => {
    store = mockStore({
      timesheets: {
        timesheets: [
          {
            id: "ts1",
            projectId: "101",
            totalHours: 8,
            weekStartDate: "2024-02-12",
            submittedAt: "2024-02-18",
            status: "SUBMITTED",
          },
        ],
        isLoading: false,
        error: null,
        stats: {},
      },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter rejection reason"), {
      target: { value: "Incomplete hours" },
    });
    fireEvent.click(screen.getByText("Reject"));

    await waitFor(() => {
      expect(timesheetSlice.rejectTimesheet).toHaveBeenCalledWith({
        timesheetId: "ts1",
        reason: "Incomplete hours",
      });
    });
  });

  test("should display loading state", () => {
    store = mockStore({
      timesheets: {
        timesheets: [],
        isLoading: true,
        error: null,
        stats: {},
      },
    });

    renderComponent();
    expect(screen.getByText("Loading timesheets...")).toBeInTheDocument();
  });

  test("should display error message", () => {
    store = mockStore({
      timesheets: {
        timesheets: [],
        isLoading: false,
        error: "Failed to fetch timesheets",
        stats: {},
      },
    });

    renderComponent();
    expect(screen.getByText("Failed to fetch timesheets")).toBeInTheDocument();
  });
});