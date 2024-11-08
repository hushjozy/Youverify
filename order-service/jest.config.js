export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 15000,
  // transform: {
  //   "^.+\\.tsx?$": "ts-jest",
  // },
  // moduleNameMapper: {
  //   "^(\\.{1,2}/.*)\\.js$": "$1",
  // },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
