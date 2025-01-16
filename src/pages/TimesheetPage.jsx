import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimesheets } from "../features/timesheets/timesheetSlice";
import Spinner from "../components/shared/Spinner";

const TimesheetPage = () => {
  const dispatch = useDispatch();
  const { timesheets, isLoading } = useSelector((state) => state.timesheets);

  useEffect(() => {
    dispatch(fetchTimesheets());
  }, [dispatch]);

  if (isLoading) return <Spinner />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Timesheets</h1>
      <div className="bg-white shadow rounded p-4">
        {timesheets.length ? (
          <ul>
            {timesheets.map((timesheet) => (
              <li key={timesheet.id} className="border-b py-2">
                {timesheet.description} - {timesheet.hours} hours
              </li>
            ))}
          </ul>
        ) : (
          <p>No timesheets found.</p>
        )}
      </div>
    </div>
  );
};

export default TimesheetPage;