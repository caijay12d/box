module.exports = {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/tests/global-setup.js',
  globalTeardown: '<rootDir>/tests/global-teardown.js',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testTimeout: 60000,
  verbose: true,
  collectCoverage: false,
  // Run tests sequentially (Puppeteer browsers are resource-heavy)
  maxWorkers: 1,
};
