import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import authReducer from "./redux/slices/authSlice";
import projectReducer from "./redux/slices/projectSlice";
import timesheetReducer from "./redux/slices/timesheetSlice";
import "./index.css";

const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    timesheet: timesheetReducer,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
