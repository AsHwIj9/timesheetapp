import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import projectReducer from "./project/projectSlice";
import timesheetReducer from "./timesheet/timesheetSlice";
import metricsReducer from "./metrics/metricsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  project: projectReducer,
  timesheet: timesheetReducer,
  metrics: metricsReducer,
});

export default rootReducer;
