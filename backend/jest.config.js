/**
 * Jest configuration for backend unit tests.
 * Tests run without a real database (we mock db.js).
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
};
