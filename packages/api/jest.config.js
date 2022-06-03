// jest.config.js
require('dotenv').config({ path: './.env.test' })

module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./test/setup.ts'],
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
}
