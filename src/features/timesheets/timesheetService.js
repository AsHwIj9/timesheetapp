import API from "../../utils/api";

const getAllTimesheets = async () => {
  const response = await API.get("/timesheets");
  return response.data;
};

const timesheetService = { getAllTimesheets };
export default timesheetService;