/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: {
    'package.json': '<rootDir>/package.json',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  verbose: true,
  transform: tsjPreset.transform,
  testTimeout: 20000,
  maxWorkers: 1,
};
