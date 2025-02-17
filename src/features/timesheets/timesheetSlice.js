import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import timesheetService from "./timesheetService";


export const fetchUserTimesheets = createAsyncThunk(
  "timesheets/fetchUser",
  async (userId, thunkAPI) => {
    try {
      const response = await timesheetService.getUserTimesheets(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


export const fetchProjectTimesheets = createAsyncThunk(
  "timesheets/fetchProject",
  async ({ projectId, startDate, endDate }, thunkAPI) => {
    try {
      const response = await timesheetService.getProjectTimesheets(
        projectId,
        startDate,
        endDate
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


export const approveTimesheet = createAsyncThunk(
  "timesheets/approve",
  async (timesheetId, thunkAPI) => {
    try {
      const response = await timesheetService.approveTimesheet(timesheetId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


export const rejectTimesheet = createAsyncThunk(
  "timesheets/reject",
  async ({ timesheetId, reason }, thunkAPI) => {
    try {
      const response = await timesheetService.rejectTimesheet(timesheetId, reason);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const submitTimesheet = createAsyncThunk(
  "timesheets/submit",
  async (timesheetData, thunkAPI) => {
    try {
      const response = await timesheetService.submitTimesheet(timesheetData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const timesheetSlice = createSlice({
  name: "timesheets",
  initialState: {
    timesheets: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearTimesheets: (state) => {
      state.timesheets = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Timesheets
      .addCase(fetchUserTimesheets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTimesheets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timesheets = action.payload;
        state.error = null;
      })
      .addCase(fetchUserTimesheets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Project Timesheets
      .addCase(fetchProjectTimesheets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectTimesheets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timesheets = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectTimesheets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Approve Timesheet
      .addCase(approveTimesheet.pending, (state) => {
        state.error = null;
      })
      .addCase(approveTimesheet.fulfilled, (state, action) => {
        state.timesheets = state.timesheets.map((timesheet) =>
          timesheet.id === action.payload.id ? action.payload : timesheet
        );
        state.error = null;
      })
      .addCase(approveTimesheet.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(submitTimesheet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitTimesheet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timesheets.push(action.payload);
        state.error = null;
      })
      .addCase(submitTimesheet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reject Timesheet
      .addCase(rejectTimesheet.pending, (state) => {
        state.error = null;
      })
      .addCase(rejectTimesheet.fulfilled, (state, action) => {
        state.timesheets = state.timesheets.map((timesheet) =>
          timesheet.id === action.payload.id ? action.payload : timesheet
        );
        state.error = null;
      })
      .addCase(rejectTimesheet.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTimesheets, clearError } = timesheetSlice.actions;
export default timesheetSlice.reducer;
