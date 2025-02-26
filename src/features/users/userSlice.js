import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService.js";

const initialState = {
  user: null,
  users: [],
  userStats: null,  
  searchedUser: null,
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, thunkAPI) => {
  try {
    return await userService.getAllUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteUserById = createAsyncThunk("users/delete", async (userId, thunkAPI) => {
  try {
    await userService.deleteUser(userId);
    return userId; // Return the deleted user's ID
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});


export const fetchUserById = createAsyncThunk("users/fetchById", async (userId, thunkAPI) => {
  try {
    return await userService.getUserById(userId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});


export const fetchUserStats = createAsyncThunk(
  "users/fetchStats",
  async ({ startDate, endDate }, thunkAPI) => {
    try {
      return await userService.getUserStats(startDate, endDate);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
      state.error = null;
    })
    .addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(deleteUserById.pending, (state) => {
      state.error = null;
    })
    .addCase(deleteUserById.fulfilled, (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.error = null;
    })
    .addCase(deleteUserById.rejected, (state, action) => {
      state.error = action.payload;
    })
    .addCase(fetchUserStats.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchUserStats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userStats = action.payload;
      state.error = null;
    })
    .addCase(fetchUserStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    .addCase(fetchUserById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchUserById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.searchedUser = action.payload;
      state.error = null;
    })
    .addCase(fetchUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.searchedUser = null;
    });
  },
});

export const { setUser, logoutUser, clearError } = userSlice.actions;

export default userSlice.reducer;