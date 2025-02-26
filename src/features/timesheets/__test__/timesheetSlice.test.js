import reducer, {
    fetchUserTimesheets,
    approveTimesheet,
    rejectTimesheet,
    submitTimesheet,
    fetchTimesheetById,
    fetchTimesheetStats,
    clearTimesheets,
    clearError
  } from '../timesheetSlice.js';
  import timesheetService from './timesheetService.js';
  
  jest.mock('../timesheetService.js'); 
  
  describe('timesheetSlice', () => {
    const initialState = {
      timesheets: [],
      isLoading: false,
      error: null,
    };
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  
    it('should handle clearTimesheets action', () => {
      const previousState = { ...initialState, timesheets: [{ id: 1 }] };
      expect(reducer(previousState, clearTimesheets())).toEqual(initialState);
    });
  
    it('should handle clearError action', () => {
      const previousState = { ...initialState, error: 'Some error' };
      expect(reducer(previousState, clearError())).toEqual(initialState);
    });
  
    // Test fetchUserTimesheets thunk
    it('should handle fetchUserTimesheets fulfilled', async () => {
      const mockTimesheets = [{ id: 1, hours: 8 }];
      timesheetService.getUserTimesheets.mockResolvedValue(mockTimesheets);
  
      const action = await fetchUserTimesheets.fulfilled(mockTimesheets);
      const state = reducer(initialState, action);
  
      expect(state.timesheets).toEqual(mockTimesheets);
      expect(state.isLoading).toBe(false);
    });
  
    it('should handle fetchUserTimesheets rejected', async () => {
      const errorMessage = 'Failed to fetch timesheets';
      const action = await fetchUserTimesheets.rejected({ payload: errorMessage });
      const state = reducer(initialState, action);
  
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  
    // Test approveTimesheet thunk
    it('should handle approveTimesheet fulfilled', async () => {
      const timesheet = { id: 1, status: 'APPROVED' };
      timesheetService.approveTimesheet.mockResolvedValue(timesheet);
  
      const action = await approveTimesheet.fulfilled(timesheet);
      const previousState = { ...initialState, timesheets: [{ id: 1, status: 'PENDING' }] };
      const state = reducer(previousState, action);
  
      expect(state.timesheets[0].status).toBe('APPROVED');
    });
  
    // Test rejectTimesheet thunk
    it('should handle rejectTimesheet fulfilled', async () => {
      const timesheet = { id: 1, status: 'REJECTED' };
      timesheetService.rejectTimesheet.mockResolvedValue(timesheet);
  
      const action = await rejectTimesheet.fulfilled(timesheet);
      const previousState = { ...initialState, timesheets: [{ id: 1, status: 'PENDING' }] };
      const state = reducer(previousState, action);
  
      expect(state.timesheets[0].status).toBe('REJECTED');
    });
  
    // Test submitTimesheet thunk
    it('should handle submitTimesheet fulfilled', async () => {
      const newTimesheet = { id: 2, hours: 6 };
      timesheetService.submitTimesheet.mockResolvedValue(newTimesheet);
  
      const action = await submitTimesheet.fulfilled(newTimesheet);
      const state = reducer(initialState, action);
  
      expect(state.timesheets).toContainEqual(newTimesheet);
    });
  
    // Test fetchTimesheetById thunk
    it('should handle fetchTimesheetById fulfilled', async () => {
      const timesheet = { id: 3, hours: 7 };
      timesheetService.getTimesheetById.mockResolvedValue(timesheet);
  
      const action = await fetchTimesheetById.fulfilled([timesheet]);
      const state = reducer(initialState, action);
  
      expect(state.timesheets).toEqual([timesheet]);
    });
  
    // Test fetchTimesheetStats thunk
    it('should handle fetchTimesheetStats fulfilled', async () => {
      const stats = { totalHours: 40 };
      timesheetService.getTimesheetStats.mockResolvedValue(stats);
  
      const action = await fetchTimesheetStats.fulfilled(stats);
      const state = reducer(initialState, action);
  
      expect(state.stats).toEqual(stats);
    });
  });