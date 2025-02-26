import reducer, { loginUser, logout } from "../authSlice.js";
import authService from "../authService.js";

// Mock authService
jest.mock("../authService");

describe("authSlice", () => {
  const initialState = {
    user: null,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("should handle initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should handle successful login", async () => {

    const mockUserData = {
      token: "mocked-jwt-token",
      username: "john_doe",
      role: "USER",
    };
    authService.login.mockResolvedValue(mockUserData);

    // Dispatch the thunk action
    const action = await loginUser({ username: "john", password: "password123" });
    const state = reducer(initialState, { type: loginUser.fulfilled, payload: mockUserData });

    // Assertions
    expect(authService.login).toHaveBeenCalledWith({ username: "john", password: "password123" });
    expect(state.user).toEqual({ username: "john_doe", role: "USER" });
    expect(localStorage.getItem("token")).toBe("mocked-jwt-token");
    expect(localStorage.getItem("user")).toBe(JSON.stringify({ username: "john_doe", role: "USER" }));
  });

  it("should handle failed login", async () => {
    const errorMessage = "Invalid credentials";
    authService.login.mockRejectedValue({ response: { data: errorMessage } });

    const action = await loginUser({ username: "invalid", password: "wrongpass" });
    const state = reducer(initialState, { type: loginUser.rejected, payload: errorMessage });

    expect(state.user).toBeNull();
    expect(state.error).toBe(errorMessage);
    expect(state.isLoading).toBe(false);
  });

  it("should handle logout", () => {
    const loggedInState = {
      user: { username: "john_doe", role: "USER" },
      isLoading: false,
      error: null,
    };

    const state = reducer(loggedInState, logout());

    expect(state.user).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});