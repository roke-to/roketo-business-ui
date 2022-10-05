module.exports = {
  transform: {
    '^.+\\.ts?$': 'babel-jest',
  },
  testRegex: ['.*\\.(spec|test)\\.ts?$'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  presets: ['@babel/preset-env', ['@babel/preset-react', {runtime: 'automatic'}]],
};
