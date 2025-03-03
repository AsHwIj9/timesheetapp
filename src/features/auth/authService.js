import API from "../../utils/api.js";

const login = async (credentials) => {
  const response = await API.post("/auth/login", credentials);  
  return response.data;
};

const authService = { login };
export default authService;