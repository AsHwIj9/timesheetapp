import store from "../app/store";
import authReducer, { loginUser } from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import projectReducer from "../features/projects/projectSlice";
import timesheetReducer from "../features/timesheets/timesheetSlice";

describe("Redux Store Configuration", () => {
  it("should initialize the store with the correct reducers", () => {
    const state = store.getState();
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("users");
    expect(state).toHaveProperty("projects");
    expect(state).toHaveProperty("timesheets");
  });

  it("should use the correct reducer for auth", () => {
    const initialState = authReducer(undefined, { type: "@@INIT" });
    expect(store.getState().auth).toEqual(initialState);
  });

  it("should use the correct reducer for users", () => {
    const initialState = userReducer(undefined, { type: "@@INIT" });
    expect(store.getState().users).toEqual(initialState);
  });

  it("should use the correct reducer for projects", () => {
    const initialState = projectReducer(undefined, { type: "@@INIT" });
    expect(store.getState().projects).toEqual(initialState);
  });

  it("should use the correct reducer for timesheets", () => {
    const initialState = timesheetReducer(undefined, { type: "@@INIT" });
    expect(store.getState().timesheets).toEqual(initialState);
  });

  it("should update auth state when loginUser action is dispatched", () => {
    const mockUser = {
      token: "fake-jwt-token",
      user: { id: 1, name: "John Doe", role: "USER" },
    };

    // Dispatch an action to update auth state
    store.dispatch({ type: loginUser.fulfilled.type, payload: mockUser });

    // Assert that the state is updated
    const updatedState = store.getState().auth;
    expect(updatedState.user).toEqual(mockUser.user);
    expect(updatedState.token).toEqual(mockUser.token);
  });
});