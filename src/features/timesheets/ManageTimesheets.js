import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock, Briefcase } from 'lucide-react';
import { 
  fetchUserTimesheets, 
  fetchTimesheetById,
  fetchProjectTimesheets, 
  approveTimesheet, 
  rejectTimesheet,
  fetchTimesheetStats 
} from "../../features/timesheets/timesheetSlice.js";

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
    <div className="flex items-center space-x-4">
      <Icon className="h-8 w-8 text-blue-500" />
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const DataTable = ({ title, data }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="font-medium text-gray-900">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left py-3 px-6 text-gray-600 font-medium text-sm">
              {title.includes('Project') ? 'Project ID' : 'User ID'}
            </th>
            <th className="text-right py-3 px-6 text-gray-600 font-medium text-sm">Hours</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Object.entries(data).map(([id, hours]) => (
            <tr key={id} className="hover:bg-gray-50">
              <td className="py-3 px-6 text-gray-900">{id}</td>
              <td className="py-3 px-6 text-right text-gray-900">{hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TimesheetCard = ({ timesheet, onApprove, onReject, rejectionReason, onReasonChange }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="space-y-2">
          <p className="font-semibold">Timesheet ID: {timesheet.id}</p>
          <p className="text-gray-600">Project ID: {timesheet.projectId}</p>
          <p className="text-gray-600">Total Hours: {timesheet.totalHours}</p>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">Week Starting: {formatDate(timesheet.weekStartDate)}</p>
          <p className="text-gray-600">Submitted: {formatDate(timesheet.submittedAt)}</p>
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

      {timesheet.status === 'SUBMITTED' && (
        <div className="flex gap-4 items-center mt-4">
          <button 
            onClick={() => onApprove(timesheet.id)} 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Approve
          </button>
          <input 
            type="text" 
            placeholder="Enter rejection reason" 
            value={rejectionReason || ""}
            onChange={(e) => onReasonChange(timesheet.id, e.target.value)}
            className="border border-gray-300 p-2 flex-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
          />
          <button 
            onClick={() => onReject(timesheet.id)} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

const ManageTimesheets = () => {
  const dispatch = useDispatch();
  const { timesheets, isLoading, error, stats } = useSelector((state) => state.timesheets);

  const [userId, setUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [timesheetId, setTimesheetId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [searchType, setSearchType] = useState("user");

  useEffect(() => {
    dispatch(fetchTimesheetStats());
  }, [dispatch]);

  const handleSearch = async () => {
    try {
      if (searchType === "user" && userId) {
        await dispatch(fetchUserTimesheets(userId)).unwrap();
      } else if (searchType === "project" && projectId && startDate && endDate) {
        await dispatch(fetchProjectTimesheets({ projectId, startDate, endDate })).unwrap();
      } else if (searchType === "timesheet" && timesheetId) {
        await dispatch(fetchTimesheetById(timesheetId)).unwrap();
      } else {
        console.error("Invalid search parameters");
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
        await dispatch(rejectTimesheet({ timesheetId, reason })).unwrap();
        handleSearch();
      }
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  const handleReasonChange = (timesheetId, reason) => {
    setRejectionReasons(prev => ({...prev, [timesheetId]: reason}));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Timesheets</h1>

      {stats && (
        <div className="space-y-8 p-6 bg-gray-50 rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              icon={Clock}
              title="Total Submitted Timesheets"
              value={stats.totalSubmittedTimesheets}
            />
            <StatCard 
              icon={Clock}
              title="Total Hours"
              value={stats.totalBilledHours}
            />
            <StatCard 
              icon={Briefcase}
              title="Active Projects"
              value={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataTable 
              title="Hours Per Project"
              data={stats.hoursPerProject || {}}
            />
            <DataTable 
              title="Hours Per User"
              data={stats.hoursPerUser || {}}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setSearchType("user")} 
            className={`px-4 py-2 rounded-lg transition-colors ${searchType === "user" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Search by User ID
          </button>
          <button 
            onClick={() => setSearchType("project")} 
            className={`px-4 py-2 rounded-lg transition-colors ${searchType === "project" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Search by Project ID
          </button>
          <button 
            onClick={() => setSearchType("timesheet")} 
            className={`px-4 py-2 rounded-lg transition-colors ${searchType === "timesheet" ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Search by Timesheet ID
          </button>
        </div>

        <div className="space-y-4">
          {searchType === "user" && (
            <input 
              type="text" 
              placeholder="Enter User ID" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
              className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          )}
          
          {searchType === "project" && (
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Enter Project ID" 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)} 
                className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                />
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                />
              </div>
            </div>
          )}
          
          {searchType === "timesheet" && (
            <input 
              type="text" 
              placeholder="Enter Timesheet ID" 
              value={timesheetId} 
              onChange={(e) => setTimesheetId(e.target.value)} 
              className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          )}

          <button 
            onClick={handleSearch} 
            className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search Timesheets
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-500">Loading timesheets...</div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {Array.isArray(timesheets) && timesheets.map((timesheet) => (
          <TimesheetCard
            key={timesheet.id}
            timesheet={timesheet}
            onApprove={handleApprove}
            onReject={handleReject}
            rejectionReason={rejectionReasons[timesheet.id]}
            onReasonChange={handleReasonChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageTimesheets;