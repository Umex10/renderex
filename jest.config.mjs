import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
    collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}", 
    "!src/**/*.d.ts",           
    "!src/**/index.{ts,tsx}",   
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"], 
};

export default createJestConfig(customJestConfig);
