module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFiles: ['./jest.setup.js'],
  verbose: true,
  testTimeout: 30000, // 30 seconds
  collectCoverageFrom: [
    'lib/**/*.js',
    '!**/node_modules/**'
  ]
}; 