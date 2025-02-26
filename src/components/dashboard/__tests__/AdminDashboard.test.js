import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import AdminDashboard from "../components/AdminDashboard";


jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const mockDashboardData = {
  activeProjects: 12,
  totalResources: 45,
  totalBilledHours: 2340,
  averageUtilization: 78.5,
};

describe("AdminDashboard Component", () => {
  beforeEach(() => {

    jest.clearAllMocks();
    

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "mock-token"),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  test("renders loading state initially", () => {

    axios.get.mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("fetches and displays dashboard data", async () => {

    axios.get.mockResolvedValueOnce({ data: mockDashboardData });
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/metrics/dashboard",
      { headers: { Authorization: "Bearer mock-token" } }
    );
    

    await waitFor(() => {
      expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument(); // activeProjects
      expect(screen.getByText("45")).toBeInTheDocument(); // totalResources
      expect(screen.getByText("2340")).toBeInTheDocument(); // totalBilledHours
      expect(screen.getByText("78.5%")).toBeInTheDocument(); // averageUtilization
    });
  });

  test("displays error message when API call fails", async () => {

    axios.get.mockRejectedValueOnce(new Error("API error"));
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText("Failed to load dashboard data.")).toBeInTheDocument();
    });
  });

  test("handles form input changes correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: mockDashboardData });
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText("Create New User")).toBeInTheDocument();
    });
    

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
    const roleSelect = screen.getByLabelText("Role");
    

    userEvent.type(usernameInput, "testuser");
    userEvent.type(emailInput, "test@example.com");
    userEvent.type(passwordInput, "password123");
    userEvent.type(confirmPasswordInput, "password123");
    userEvent.selectOptions(roleSelect, "ADMIN");
    
    expect(usernameInput).toHaveValue("testuser");
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
    expect(confirmPasswordInput).toHaveValue("password123");
    expect(roleSelect).toHaveValue("ADMIN");
  });

  test("validates passwords match before submission", async () => {
    axios.get.mockResolvedValueOnce({ data: mockDashboardData });
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText("Create New User")).toBeInTheDocument();
    });
    

    userEvent.type(screen.getByPlaceholderText("Enter username"), "testuser");
    userEvent.type(screen.getByPlaceholderText("Enter email"), "test@example.com");
    userEvent.type(screen.getByPlaceholderText("Enter password"), "password123");
    userEvent.type(screen.getByPlaceholderText("Confirm password"), "password456");
    

    fireEvent.click(screen.getByText("Create User"));
    

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    

    expect(axios.post).not.toHaveBeenCalled();
  });

  test("successfully creates a new user", async () => {
    axios.get.mockResolvedValueOnce({ data: mockDashboardData });
    axios.post.mockResolvedValueOnce({});
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText("Create New User")).toBeInTheDocument();
    });
    

    userEvent.type(screen.getByPlaceholderText("Enter username"), "testuser");
    userEvent.type(screen.getByPlaceholderText("Enter email"), "test@example.com");
    userEvent.type(screen.getByPlaceholderText("Enter password"), "password123");
    userEvent.type(screen.getByPlaceholderText("Confirm password"), "password123");
    

    fireEvent.click(screen.getByText("Create User"));
    
    await waitFor(() => {

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/api/users",
        {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
          confirmPassword: "password123",
          role: "USER"
        },
        { headers: { Authorization: "Bearer mock-token" } }
      );
      

      expect(screen.getByText("User successfully created!")).toBeInTheDocument();
      

      expect(screen.getByPlaceholderText("Enter username")).toHaveValue("");
      expect(screen.getByPlaceholderText("Enter email")).toHaveValue("");
    });
  });

  test("displays error message when user creation fails", async () => {
    axios.get.mockResolvedValueOnce({ data: mockDashboardData });
    axios.post.mockRejectedValueOnce({ 
      response: { data: { message: "Username already exists" } } 
    });
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText("Create New User")).toBeInTheDocument();
    });
    

    userEvent.type(screen.getByPlaceholderText("Enter username"), "existinguser");
    userEvent.type(screen.getByPlaceholderText("Enter email"), "test@example.com");
    userEvent.type(screen.getByPlaceholderText("Enter password"), "password123");
    userEvent.type(screen.getByPlaceholderText("Confirm password"), "password123");
    

    fireEvent.click(screen.getByText("Create User"));
    
    await waitFor(() => {
      expect(screen.getByText("Username already exists")).toBeInTheDocument();
    });
  });

  test("navigation buttons redirect to correct routes", async () => {

    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockImplementation(() => mockNavigate);
    
    axios.get.mockResolvedValueOnce({ data: mockDashboardData });
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText("Manage Users")).toBeInTheDocument();
    });
    

    fireEvent.click(screen.getByText("Manage Users"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/users");
    
    fireEvent.click(screen.getByText("Manage Projects"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/projects");
    
    fireEvent.click(screen.getByText("Manage Timesheets"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/timesheets");
  });
});