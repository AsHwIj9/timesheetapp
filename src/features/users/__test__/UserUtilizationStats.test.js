import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserUtilizationStats from "../UserUtilizationStats";


jest.mock("recharts", () => ({
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

describe("UserUtilizationStats Component", () => {
  const mockData = [
    {
      userId: "1",
      username: "John Doe",
      totalHours: 40,
      utilizationPercentage: 80,
      weekStartDate: "2025-02-19",
    },
    {
      userId: "2",
      username: "Jane Smith",
      totalHours: 30,
      utilizationPercentage: 60,
      weekStartDate: "2025-02-19",
    },
    {
      userId: "3",
      username: "Alice Johnson",
      totalHours: 0,
      utilizationPercentage: 0,
      weekStartDate: "2025-02-19",
    },
  ];

  it("renders without crashing", () => {
    render(<UserUtilizationStats data={mockData} />);
    expect(screen.getByText("Active Users")).toBeInTheDocument();
  });

  it("displays the correct number of active users", () => {
    render(<UserUtilizationStats data={mockData} />);
    expect(screen.getByText("2 / 3")).toBeInTheDocument(); // Only two users with hours > 0
  });

  it("displays the correct average utilization", () => {
    render(<UserUtilizationStats data={mockData} />);
    expect(screen.getByText("47%")).toBeInTheDocument(); // (80 + 60 + 0) / 3 = 46.66 ~ 47%
  });

  it("displays the correct peak utilization", () => {
    render(<UserUtilizationStats data={mockData} />);
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("renders the bar chart", () => {
    render(<UserUtilizationStats data={mockData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("renders the table with user data", () => {
    render(<UserUtilizationStats data={mockData} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("40h")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("2025-02-19")).toBeInTheDocument();
  });

  it("renders correctly with empty data", () => {
    render(<UserUtilizationStats data={[]} />);
    expect(screen.getByText("0 / 0")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders without crashing when utilizationPercentage is missing", () => {
    const incompleteData = [{ userId: "4", username: "Bob", totalHours: 20 }];
    render(<UserUtilizationStats data={incompleteData} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});