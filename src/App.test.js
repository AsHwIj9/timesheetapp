import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

jest.mock("./components/auth/Login", () => () => <div>Login Page</div>);
jest.mock("./components/dashboard/AdminDashboard", () => () => <div>Admin Dashboard</div>);
jest.mock("./components/dashboard/UserDashboard", () => () => <div>User Dashboard</div>);
jest.mock("./features/users/ManageUsers", () => () => <div>Manage Users</div>);
jest.mock("./features/projects/ManageProjects", () => () => <div>Manage Projects</div>);
jest.mock("./features/timesheets/ManageTimesheets", () => () => <div>Manage Timesheets</div>);
jest.mock("./components/shared/ProtectedRoute", () => ({ children }) => <div>{children}</div>);

describe("App Routing", () => {
  const renderWithRouter = (initialEntries) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    );
  };

  it("redirects from '/' to '/login'", () => {
    renderWithRouter(["/"]);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders the Login page on '/login' route", () => {
    renderWithRouter(["/login"]);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders the Admin Dashboard for '/admin/dashboard'", () => {
    renderWithRouter(["/admin/dashboard"]);
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("renders Manage Users page on '/admin/users'", () => {
    renderWithRouter(["/admin/users"]);
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
  });

  it("renders Manage Projects page on '/admin/projects'", () => {
    renderWithRouter(["/admin/projects"]);
    expect(screen.getByText("Manage Projects")).toBeInTheDocument();
  });

  it("renders Manage Timesheets page on '/admin/timesheets'", () => {
    renderWithRouter(["/admin/timesheets"]);
    expect(screen.getByText("Manage Timesheets")).toBeInTheDocument();
  });

  it("renders the User Dashboard for '/user/dashboard'", () => {
    renderWithRouter(["/user/dashboard"]);
    expect(screen.getByText("User Dashboard")).toBeInTheDocument();
  });

  it("renders 404 page for an unknown route", () => {
    renderWithRouter(["/some/unknown/route"]);
    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
  });
});