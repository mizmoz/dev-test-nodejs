module.exports = {
  restoreMocks: true,
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testTimeout: 90000,
};
