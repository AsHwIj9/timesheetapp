import API from "../../utils/api";

const getAllUsers = async () => {
  const response = await API.get("/users");
  return response.data;
};

const userService = { getAllUsers };
export default userService;