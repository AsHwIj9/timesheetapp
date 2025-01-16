import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import projectReducer from "../features/projects/projectSlice";
import timesheetReducer from "../features/timesheets/timesheetSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    projects: projectReducer,
    timesheets: timesheetReducer,
  },
});

export default store;