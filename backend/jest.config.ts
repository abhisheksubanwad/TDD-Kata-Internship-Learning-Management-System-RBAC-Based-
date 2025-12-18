export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
   setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"]
};
