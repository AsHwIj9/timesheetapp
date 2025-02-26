import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import userReducer from "../features/users/userSlice.js";
import projectReducer from "../features/projects/projectSlice.js";
import timesheetReducer from "../features/timesheets/timesheetSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    projects: projectReducer,
    timesheets: timesheetReducer,
  },
});

export default store;
