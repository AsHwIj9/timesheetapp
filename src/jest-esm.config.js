export default {

    testEnvironment: 'jsdom',
    

    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    

    transformIgnorePatterns: [
      '/node_modules/(?!axios|lucide-react).+\\.js$'
    ],
    

    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },
    

    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    

    moduleFileExtensions: ['js', 'jsx', 'json'],
    

    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/**/*.test.{js,jsx}',
      '!**/node_modules/**',
      '!**/vendor/**'
    ],
    

    type: 'module'
  };