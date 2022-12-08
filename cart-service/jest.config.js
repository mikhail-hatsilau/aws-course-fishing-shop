module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  coverageReporters: [
    "text",
    "lcov",
  ],
  moduleDirectories: [
    "node_modules"
  ],
  roots: [
    "<rootDir>/test/", 
    "<rootDir>/src/"
  ],
  testEnvironment: "node",  
  transformIgnorePatterns: [
    "/node_modules/",
  ],
};