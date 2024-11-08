export default {
  preset: "ts-jest/presets/default-esm", // Use ESM preset for ts-jest
  testEnvironment: "node", // Set the test environment
  extensionsToTreatAsEsm: [".ts"],
  testTimeout: 15000,
  transform: {
    "^.+\\.ts?$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
