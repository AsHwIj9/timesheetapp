import authService from "../../auth/authService.js";
import axios from "axios";

jest.mock("axios");

describe("authService", () => {
  describe("login", () => {
    it("should successfully return user data on valid credentials", async () => {
      const mockUserData = {
        token: "mocked-jwt-token",
        user: { id: 1, name: "John Doe", role: "USER" }
      };

      // Mock Axios response
      axios.post.mockResolvedValue({ data: mockUserData });

      const credentials = { username: "john", password: "password123" };
      const result = await authService.login(credentials);

      expect(axios.post).toHaveBeenCalledWith("/auth/login", credentials);
      expect(result).toEqual(mockUserData);
    });

    it("should throw an error on failed login attempt", async () => {
      const mockError = new Error("Invalid credentials");
      axios.post.mockRejectedValue(mockError);

      const credentials = { username: "invalid", password: "wrongpass" };

      await expect(authService.login(credentials)).rejects.toThrow("Invalid credentials");
      expect(axios.post).toHaveBeenCalledWith("/auth/login", credentials);
    });
  });
});
