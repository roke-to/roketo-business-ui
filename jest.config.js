module.exports = {
  transform: {
    '^.+\\.ts?$': 'babel-jest',
  },
  testRegex: ['.*\\.(spec|test)\\.ts?$'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};
