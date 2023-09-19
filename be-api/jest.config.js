/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
require('./build/src/plugins/env');

const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  preset: '@shelf/jest-mongodb',
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
