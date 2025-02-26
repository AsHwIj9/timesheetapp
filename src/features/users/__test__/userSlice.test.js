import reducer, {
    fetchUsers,
    deleteUserById,
    fetchUserById,
    fetchUserStats,
    setUser,
    logoutUser,
    clearError,
  } from "../userSlice";
  
  import userService from "../userService";
  

  jest.mock("../userService");
  
  describe("userSlice", () => {
    const initialState = {
      user: null,
      users: [],
      userStats: null,
      searchedUser: null,
      isLoading: false,
      error: null,
    };
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return the initial state", () => {
      expect(reducer(undefined, { type: undefined })).toEqual(initialState);
    });
  
    // ✅ Test fetchUsers
    it("should handle fetchUsers fulfilled", async () => {
      const mockUsers = [{ id: "1", username: "John Doe", role: "Admin" }];
      userService.getAllUsers.mockResolvedValueOnce(mockUsers);
  
      const action = await fetchUsers.fulfilled(mockUsers);
      const state = reducer(initialState, action);
  
      expect(state.users).toEqual(mockUsers);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  
    it("should handle fetchUsers rejected", async () => {
      const error = "Failed to fetch users";
      userService.getAllUsers.mockRejectedValueOnce(new Error(error));
  
      const action = await fetchUsers.rejected(null, { payload: error });
      const state = reducer(initialState, action);
  
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
    });
  
    // ✅ Test deleteUserById
    it("should handle deleteUserById fulfilled", async () => {
      const prevState = {
        ...initialState,
        users: [{ id: "1", username: "John Doe" }, { id: "2", username: "Jane Smith" }],
      };
  
      userService.deleteUser.mockResolvedValueOnce();
  
      const action = await deleteUserById.fulfilled("1");
      const state = reducer(prevState, action);
  
      expect(state.users).toEqual([{ id: "2", username: "Jane Smith" }]);
    });
  
    // ✅ Test fetchUserById
    it("should handle fetchUserById fulfilled", async () => {
      const mockUser = { id: "1", username: "John Doe", role: "Admin" };
      userService.getUserById.mockResolvedValueOnce(mockUser);
  
      const action = await fetchUserById.fulfilled(mockUser);
      const state = reducer(initialState, action);
  
      expect(state.searchedUser).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });
  
    // ✅ Test fetchUserStats
    it("should handle fetchUserStats fulfilled", async () => {
      const mockStats = [{ week: "2024-02-01", hoursWorked: 40 }];
      userService.getUserStats.mockResolvedValueOnce(mockStats);
  
      const action = await fetchUserStats.fulfilled(mockStats);
      const state = reducer(initialState, action);
  
      expect(state.userStats).toEqual(mockStats);
      expect(state.isLoading).toBe(false);
    });
  
    // ✅ Test synchronous reducers
    it("should handle setUser", () => {
      const action = setUser({ id: "1", username: "John Doe" });
      const state = reducer(initialState, action);
  
      expect(state.user).toEqual({ id: "1", username: "John Doe" });
    });
  
    it("should handle logoutUser", () => {
      const prevState = { ...initialState, user: { id: "1", username: "John Doe" } };
      const state = reducer(prevState, logoutUser());
  
      expect(state.user).toBeNull();
    });
  
    it("should handle clearError", () => {
      const prevState = { ...initialState, error: "Some error" };
      const state = reducer(prevState, clearError());
  
      expect(state.error).toBeNull();
    });
  });