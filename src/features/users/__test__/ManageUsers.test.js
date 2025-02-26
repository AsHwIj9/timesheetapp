// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { Provider } from "react-redux";
// import configureStore from "redux-mock-store"; // Use redux-mock-store instead
// import thunk from "redux-thunk";
// import ManageUsers from "../ManageUsers.js";
// import {
//   fetchUsers,
//   deleteUserById,
//   fetchUserById,
// } from "../userSlice.js";

// // Mock the userSlice
// jest.mock("../userSlice", () => ({
//   fetchUsers: jest.fn(),
//   deleteUserById: jest.fn(),
//   fetchUserById: jest.fn(),
//   fetchUserStats: jest.fn(),
// }));

// // Create mock store with middleware
// const middlewares = [thunk];
// const mockStore = configureStore(middlewares);

// describe("ManageUsers Component", () => {
//   let store;
  
//   beforeEach(() => {
//     // Initialize mockStore with initial state
//     store = mockStore({
//       users: {
//         users: [
//           { id: "1", username: "John Doe", role: "Manager" },
//           { id: "2", username: "Jane Smith", role: "Employee" },
//         ],
//         isLoading: false,
//         error: null,
//         searchedUser: null,
//         userStats: null,
//       }
//     });
    
//     // Clear all mocks
//     jest.clearAllMocks();
//   });

//   const renderComponent = () => {
//     return render(
//       <Provider store={store}>
//         <ManageUsers />
//       </Provider>
//     );
//   };

//   describe("Component Rendering", () => {
//     it("renders the ManageUsers component correctly", () => {
//       renderComponent();
//       expect(screen.getByText("Manage Users")).toBeInTheDocument();
//       expect(screen.getByPlaceholderText("Search by User ID")).toBeInTheDocument();
//     });
  
//     it("dispatches fetchUsers on mount", () => {
//       renderComponent();
//       expect(fetchUsers).toHaveBeenCalled();
//     });
  
//     it("displays users in the table", () => {
//       renderComponent();
//       expect(screen.getByText("John Doe")).toBeInTheDocument();
//       expect(screen.getByText("Jane Smith")).toBeInTheDocument();
//     });
//   });

//   describe("User Interactions", () => {
//     it("handles user search by ID", async () => {
//       renderComponent();
//       fireEvent.change(screen.getByPlaceholderText("Search by User ID"), {
//         target: { value: "1" },
//       });
//       fireEvent.click(screen.getByText("Search"));
//       await waitFor(() => {
//         expect(fetchUserById).toHaveBeenCalledWith("1");
//       });
//     });
  
//     it("deletes a user when delete button is clicked", async () => {
//       renderComponent();
//       fireEvent.click(screen.getAllByRole("button", { name: "" })[0]); // Clicking the delete button for the first user
//       await waitFor(() => {
//         expect(deleteUserById).toHaveBeenCalledWith("1");
//       });
//     });
//   });

//   describe("Loading and Error States", () => {
//     it("shows loading indicator when isLoading is true", () => {
//       // Create a store with loading state
//       const loadingStore = mockStore({
//         users: {
//           users: [],
//           isLoading: true,
//           error: null,
//           searchedUser: null,
//           userStats: null,
//         }
//       });
      
//       render(
//         <Provider store={loadingStore}>
//           <ManageUsers />
//         </Provider>
//       );
//       expect(screen.getByText("Loading users...")).toBeInTheDocument();
//     });
  
//     it("displays error message when there's an error", () => {
//       // Create a store with error state
//       const errorStore = mockStore({
//         users: {
//           users: [],
//           isLoading: false,
//           error: "Failed to load users",
//           searchedUser: null,
//           userStats: null,
//         }
//       });
      
//       render(
//         <Provider store={errorStore}>
//           <ManageUsers />
//         </Provider>
//       );
//       expect(screen.getByText("Failed to load users")).toBeInTheDocument();
//     });
//   });
// });

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ManageUsers from '../ManageUsers';
import { fetchUsers, deleteUserById, fetchUserStats, fetchUserById } from "../../users/userSlice";

// Mock the userSlice actions
jest.mock("../../users/userSlice", () => ({
  fetchUsers: jest.fn(),
  deleteUserById: jest.fn(),
  fetchUserStats: jest.fn(),
  fetchUserById: jest.fn()
}));

// Mock the UserUtilizationStats component
jest.mock('../UserUtilizationStats', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="user-utilization-stats" />)
  };
});

const mockStore = configureStore([thunk]);

describe('ManageUsers Component', () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      users: {
        users: [
          { id: '1', username: 'testuser1', role: 'Admin' },
          { id: '2', username: 'testuser2', role: 'User' }
        ],
        isLoading: false,
        error: null,
        userStats: null,
        searchedUser: null
      }
    };

    store = mockStore(initialState);

    // Mock the action implementations
    fetchUsers.mockImplementation(() => {
      return () => Promise.resolve();
    });

    deleteUserById.mockImplementation((userId) => {
      return () => Promise.resolve();
    });

    fetchUserStats.mockImplementation(({ startDate, endDate }) => {
      return () => Promise.resolve();
    });

    fetchUserById.mockImplementation((userId) => {
      return () => Promise.resolve();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with user list', () => {
    render(
      <Provider store={store}>
        <ManageUsers />
      </Provider>
    );

    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(screen.getByText('testuser1')).toBeInTheDocument();
    expect(screen.getByText('testuser2')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  test('calls fetchUsers on component mount', () => {
    render(
      <Provider store={store}>
        <ManageUsers />
      </Provider>
    );

    expect(fetchUsers).toHaveBeenCalled();
  });

  test('displays loading state when isLoading is true', () => {
    const loadingState = {
      users: {
        ...initialState.users,
        isLoading: true
      }
    };
    const loadingStore = mockStore(loadingState);

    render(
      <Provider store={loadingStore}>
        <ManageUsers />
      </Provider>
    );

    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  test('displays error message when error exists', () => {
    const errorState = {
      users: {
        ...initialState.users,
        error: 'Failed to fetch users'
      }
    };
    const errorStore = mockStore(errorState);

    render(
      <Provider store={errorStore}>
        <ManageUsers />
      </Provider>
    );

    expect(screen.getByText('Failed to fetch users')).toBeInTheDocument();
  });

  test('calls deleteUserById when delete button is clicked', async () => {
    render(
      <Provider store={store}>
        <ManageUsers />
      </Provider>
    );

    // Find and click the first delete button
    const deleteButtons = screen.getAllByRole('button', { name: '' }); // Trash2 icon has no accessible name
    fireEvent.click(deleteButtons[0]);

    expect(deleteUserById).toHaveBeenCalledWith('1');
    expect(fetchUsers).toHaveBeenCalled();
  });

  test('calls fetchUserStats when Fetch Stats button is clicked with valid dates', async () => {
    render(
      <Provider store={store}>
        <ManageUsers />
      </Provider>
    );

    // Set start and end dates
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');
    
    fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-01-31' } });

    // Click the Fetch Stats button
    const fetchStatsButton = screen.getByRole('button', { name: /Fetch Stats/i });
    fireEvent.click(fetchStatsButton);

    expect(fetchUserStats).toHaveBeenCalledWith({
      startDate: '2023-01-01',
      endDate: '2023-01-31'
    });
  });

  test('shows alert when trying to fetch stats without dates', () => {
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <ManageUsers />
      </Provider>
    );

    // Try to fetch stats without setting dates
    const fetchStatsButton = screen.getByRole('button', { name: /Fetch Stats/i });
    fireEvent.click(fetchStatsButton);

    expect(alertMock).toHaveBeenCalledWith('Please select both start and end dates.');
    expect(fetchUserStats).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  test('calls fetchUserById when Search button is clicked with valid ID', () => {
    render(
      <Provider store={store}>
        <ManageUsers />
      </Provider>
    );

    // Set search ID
    const searchInput = screen.getByPlaceholderText('Search by User ID');
    fireEvent.change(searchInput, { target: { value: '1' } });

    // Click the Search button
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);

    expect(fetchUserById).toHaveBeenCalledWith('1');
  });

  test('shows alert when trying to search without ID', () => {
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <ManageUsers />
      </Provider>
    );

    // Try to search without setting ID
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);

    expect(alertMock).toHaveBeenCalledWith('Please enter a User ID.');
    expect(fetchUserById).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  test('displays searched user details when searchedUser exists', () => {
    const stateWithSearchedUser = {
      users: {
        ...initialState.users,
        searchedUser: {
          id: '1',
          username: 'testuser1',
          role: 'Admin'
        }
      }
    };
    const storeWithSearchedUser = mockStore(stateWithSearchedUser);

    render(
      <Provider store={storeWithSearchedUser}>
        <ManageUsers />
      </Provider>
    );

    expect(screen.getByText('User Details')).toBeInTheDocument();
    expect(screen.getAllByText('testuser1').length).toBeGreaterThan(0); // May appear in both search results and user list
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
  });

  test('renders UserUtilizationStats when userStats exists', () => {
    const stateWithStats = {
      users: {
        ...initialState.users,
        userStats: [
          { userId: '1', username: 'testuser1', totalHours: 40, utilizationPercentage: 80, weekStartDate: '2023-01-01' }
        ]
      }
    };
    const storeWithStats = mockStore(stateWithStats);

    render(
      <Provider store={storeWithStats}>
        <ManageUsers />
      </Provider>
    );

    expect(screen.getByTestId('user-utilization-stats')).toBeInTheDocument();
  });
});