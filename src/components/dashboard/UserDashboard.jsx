import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitTimesheet } from "../../features/timesheets/timesheetSlice";
import axios from "axios";

const UserDashboard = () => {
  const dispatch = useDispatch();
 const { user, isLoading, error } = useSelector((state) => ({
  user: state.auth.user,
  isLoading: state.timesheets.isLoading,
  error: state.timesheets.error
}));

  const [projects, setProjects] = useState([]);
  const [timesheet, setTimesheet] = useState({
    projectId: "",
    weekStartDate: "",
    dailyHours: { MONDAY: 8, TUESDAY: 8, WEDNESDAY: 8, THURSDAY: 8, FRIDAY: 8, SATURDAY: 0, SUNDAY: 0 },
    description: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setTimesheet({ ...timesheet, [e.target.name]: e.target.value });
  };

  const handleDailyHoursChange = (day, value) => {
    setTimesheet({
      ...timesheet,
      dailyHours: { ...timesheet.dailyHours, [day]: parseInt(value, 10) || 0 },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("User Object:", user); 
    console.log("User Role:", user?.role);

    if (user.role !== "USER") {
      setMessage("Only users can submit timesheets.");
      return;
    }

    const newTimesheet = {
      userId: "abc",
      projectId: timesheet.projectId,
      weekStartDate: timesheet.weekStartDate,
      dailyHours: timesheet.dailyHours,
      description: timesheet.description,
      status: "SUBMITTED",
    };

    dispatch(submitTimesheet(newTimesheet))
      .unwrap()
      .then(() => setMessage("Timesheet submitted successfully!"))
      .catch((err) => setMessage(err.message || "Error submitting timesheet."));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 py-12 px-6">
      {isLoading && (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Hello, <span className="text-blue-600">User!</span>
          </h1>
        </div>


        <div className="bg-white shadow-xl rounded-lg p-8 transform transition duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submit Timesheet</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Dropdown */}
            <select
              name="projectId"
              value={timesheet.projectId}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="weekStartDate"
              value={timesheet.weekStartDate}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            />

            {Object.keys(timesheet.dailyHours).map((day) => (
              <div key={day} className="flex justify-between">
                <label className="text-gray-700">{day}</label>
                <input
                  type="number"
                  value={timesheet.dailyHours[day]}
                  onChange={(e) => handleDailyHoursChange(day, e.target.value)}
                  className="w-16 border p-1 rounded-lg"
                  min="0"
                  max="24"
                  required
                />
              </div>
            ))}

            <textarea
              name="description"
              placeholder="Enter Description"
              value={timesheet.description}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Submit Timesheet
            </button>

            {message && <p className="text-red-500 mt-2">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;