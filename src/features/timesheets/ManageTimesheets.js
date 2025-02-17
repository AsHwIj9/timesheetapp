import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchUserTimesheets, 
  fetchProjectTimesheets, 
  approveTimesheet, 
  rejectTimesheet 
} from "../../features/timesheets/timesheetSlice";

const ManageTimesheets = () => {
  const dispatch = useDispatch();
  const { timesheets, isLoading, error } = useSelector((state) => state.timesheets);
  
  const [userId, setUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [searchType, setSearchType] = useState("user"); 

  const handleSearch = async () => {
    try {
      if (searchType === "user" && userId) {
        await dispatch(fetchUserTimesheets(userId)).unwrap();
      } else if (searchType === "project" && projectId && startDate && endDate) {
        await dispatch(fetchProjectTimesheets({ 
          projectId, 
          startDate, 
          endDate 
        })).unwrap();
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleApprove = async (timesheetId) => {
    try {
      if (window.confirm('Are you sure you want to approve this timesheet?')) {
        await dispatch(approveTimesheet(timesheetId)).unwrap();

        handleSearch();
      }
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleReject = async (timesheetId) => {
    try {
      const reason = rejectionReasons[timesheetId];
      if (!reason?.trim()) {
        alert('Please provide a rejection reason');
        return;
      }
      
      if (window.confirm('Are you sure you want to reject this timesheet?')) {
        await dispatch(rejectTimesheet({ 
          timesheetId, 
          reason 
        })).unwrap();
        
        handleSearch();
      }
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Timesheets</h1>


      <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setSearchType("user")}
            className={`px-4 py-2 rounded ${
              searchType === "user" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200"
            }`}
          >
            Search by User
          </button>
          <button
            onClick={() => setSearchType("project")}
            className={`px-4 py-2 rounded ${
              searchType === "project" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200"
            }`}
          >
            Search by Project
          </button>
        </div>

        {searchType === "user" ? (
          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-2 w-full rounded"
          />
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          </div>
        )}

        <button 
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Search Timesheets
        </button>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-4">Loading timesheets...</div>
      )}
      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded mb-4">{error}</div>
      )}

      {/* Timesheets List */}
      <div className="space-y-4">
        {timesheets.map((timesheet) => (
          <div 
            key={timesheet.id} 
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">User ID: {timesheet.userId}</p>
                <p>Project ID: {timesheet.projectId}</p>
                <p>Hours: {timesheet.hours}</p>
              </div>
              <div>
                <p>Date: {new Date(timesheet.date).toLocaleDateString()}</p>
                <p className={`font-semibold ${
                  timesheet.status === 'APPROVED' 
                    ? 'text-green-600' 
                    : timesheet.status === 'REJECTED' 
                      ? 'text-red-600' 
                      : 'text-yellow-600'
                }`}>
                  Status: {timesheet.status}
                </p>
              </div>
            </div>

            {timesheet.status === 'PENDING' && (
              <div className="flex gap-4 items-center mt-2">
                <button
                  onClick={() => handleApprove(timesheet.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <input
                  type="text"
                  placeholder="Enter rejection reason"
                  value={rejectionReasons[timesheet.id] || ""}
                  onChange={(e) => 
                    setRejectionReasons(prev => ({
                      ...prev,
                      [timesheet.id]: e.target.value
                    }))
                  }
                  className="border p-2 flex-1 rounded"
                />
                <button
                  onClick={() => handleReject(timesheet.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTimesheets;