import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectService from "./projectService";

const initialState = {
  projects: [],
  isLoading: false,
  error: null,
};


export const fetchProjects = createAsyncThunk("projects/fetchAll", async (_, thunkAPI) => {
  try {
    return await projectService.getAllProjects();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});


export const createProject = createAsyncThunk("projects/create", async (projectData, thunkAPI) => {
  try {
    return await projectService.createProject(projectData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});


export const assignUsersToProject = createAsyncThunk(
  "projects/assignUsers",
  async ({ projectId, userIds }, thunkAPI) => {
    try {
      return await projectService.assignUsersToProject({ projectId, userIds });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(assignUsersToProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignUsersToProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const projectIndex = state.projects.findIndex((p) => p.id === action.payload.id);
        if (projectIndex !== -1) {
          state.projects[projectIndex] = action.payload; // Update project in state
        }
      })
      .addCase(assignUsersToProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;