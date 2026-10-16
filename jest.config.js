const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/components/(.*)$': '<rootDir>/components/$1',

    '^@/pages/(.*)$': '<rootDir>/pages/$1',

    // hanko-elements is ESM-only; stub it so suites that pull in HankoAuth stay CommonJS-compatible
    '^@teamhanko/hanko-elements$': '<rootDir>/__mocks__/hanko-elements.ts',
  },
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/docker/'],
  modulePathIgnorePatterns: ['/docker/'],
  watchPathIgnorePatterns: ['/docker/', '/docker/mongo-data/'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
