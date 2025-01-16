import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import timesheetService from "./timesheetService";

const initialState = {
  timesheets: [],
  isLoading: false,
  error: null,
};

export const fetchTimesheets = createAsyncThunk(
  "timesheets/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await timesheetService.getAllTimesheets();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const timesheetSlice = createSlice({
  name: "timesheets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimesheets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTimesheets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timesheets = action.payload;
      })
      .addCase(fetchTimesheets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default timesheetSlice.reducer;