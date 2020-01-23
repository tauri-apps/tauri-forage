module.exports = {
  globals: {
    __DEV__: true
  },
  setupFilesAfterEnv: [
    '<rootDir>/test/jest.setup.js'
  ],
  // noStackTrace: true,
  // bail: true,
  // cache: false,
  // verbose: true,
  // watch: true,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/jest/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts'
  ],
  coverageReporters: [
    'json-summary',
    'text',
    'lcov'
  ],
  coverageThreshold: {
    global: {
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  testMatch: [
    '<rootDir>/test/__tests__/**/*.spec.ts'
  ],
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '.*\\.ts$': 'ts-jest',

  },
  transformIgnorePatterns: [
  ]
}
