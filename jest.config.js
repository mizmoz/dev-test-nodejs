module.exports = {
  roots: ["<rootDir>/src"],
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'covarage',
  testPathIgnorePatterns: ["/node_modules/"],
  verbose: true,
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  coverageThreshold: {
    global: {
      branches: 100,
      function: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageReporters:['json', 'lcov', 'text']
};
