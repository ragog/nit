export default {
    testEnvironment: 'node', // Use Node.js environment for testing
    testMatch: ['**/*.test.js'], // Match test files with .test.js
    collectCoverage: true, // Collect code coverage
    collectCoverageFrom: ['<rootDir>/**/*.js'], // Include all .js files for coverage
    coverageDirectory: 'coverage', // Save coverage reports to "coverage" folder
    verbose: true, // Show detailed test results
    transform: {}, // Disable transformations (Jest respects ESM natively with this)
  };