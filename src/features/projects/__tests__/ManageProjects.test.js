import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import ManageProjects from "../ManageProjects.js";
import * as projectSlice from "../projectSlice.js";


// The key issue is here - make sure to use the middleware properly
const mockStore = configureMockStore([thunk]);

// Mock the slice's actions
jest.mock("../projectSlice", () => ({
  fetchProjects: jest.fn(),
  createProject: jest.fn(),
  assignUsersToProject: jest.fn(),
}));

describe("ManageProjects Component", () => {
  let store;
  
  beforeEach(() => {
    // Create the mock store with initial state
    store = mockStore({
      projects: {
        projects: [],
        isLoading: false,
        error: null,
      },
    });
    
    // Mock the dispatch function
    store.dispatch = jest.fn();
    
    // Clear mock calls between tests
    jest.clearAllMocks();
  });
  
  it("renders without crashing and fetches projects", () => {
    render(
      <Provider store={store}>
        <ManageProjects />
      </Provider>
    );
    expect(screen.getByText("Manage Projects")).toBeInTheDocument();
    expect(projectSlice.fetchProjects).toHaveBeenCalled();
  });
  
  it("handles successful project creation", async () => {
    projectSlice.createProject.mockReturnValue({ unwrap: () => Promise.resolve() });
    
    render(
      <Provider store={store}>
        <ManageProjects />
      </Provider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("Project Name"), {
      target: { value: "New Project" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Project description" },
    });
    fireEvent.change(screen.getByPlaceholderText("Total Budget Hours"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("Total Billed Hours"), {
      target: { value: "50" },
    });
    fireEvent.change(screen.getByPlaceholderText("User IDs (comma-separated)"), {
      target: { value: "1,2" },
    });
    fireEvent.change(screen.getByLabelText(/Start Date/i), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/End Date/i), {
      target: { value: "2024-12-31" },
    });
    fireEvent.click(screen.getByText("Create Project"));
    
    await waitFor(() => {
      expect(projectSlice.createProject).toHaveBeenCalled();
      expect(projectSlice.fetchProjects).toHaveBeenCalled();
    });
  });
  
  it("handles user assignment to a project", async () => {
    projectSlice.assignUsersToProject.mockReturnValue({ unwrap: () => Promise.resolve() });
    
    render(
      <Provider store={store}>
        <ManageProjects />
      </Provider>
    );
    
    // Fill in assign user form
    fireEvent.change(screen.getByPlaceholderText("Project ID"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText("User IDs (comma-separated)"), {
      target: { value: "3,4" },
    });
    fireEvent.click(screen.getByText("Assign Users"));
    
    await waitFor(() => {
      expect(projectSlice.assignUsersToProject).toHaveBeenCalledWith({
        projectId: "123",
        userIds: ["3", "4"],
      });
      expect(projectSlice.fetchProjects).toHaveBeenCalled();
    });
  });
  
  it("displays loading state", () => {
    store = mockStore({
      projects: {
        projects: [],
        isLoading: true,
        error: null,
      },
    });
    
    render(
      <Provider store={store}>
        <ManageProjects />
      </Provider>
    );
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  
  it("displays an error message if an error occurs", () => {
    store = mockStore({
      projects: {
        projects: [],
        isLoading: false,
        error: "Failed to fetch projects",
      },
    });
    
    render(
      <Provider store={store}>
        <ManageProjects />
      </Provider>
    );
    
    expect(screen.getByText("Failed to fetch projects")).toBeInTheDocument();
  });
});