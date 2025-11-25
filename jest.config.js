export default {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
  collectCoverageFrom: [
    'utils/**/*.js',
    '!utils/storage.js', // Storage module uses global state, hard to test
    '!**/node_modules/**',
  ],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js',
  ],
  // Remove extensionsToTreatAsEsm since we have "type": "module" in package.json
  // Jest handles ES modules automatically when "type": "module" is present
};