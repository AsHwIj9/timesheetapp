module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  // transformIgnorePatterns: [
  //   "/node_modules/(?!(axios|lucide-react)/)"
  // ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: ["/Users/ashwijkodipadi/TimeSheet /timesheetapp/src/setupTests.js"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["node_modules", "src"]
};