// jest.config.js
require('dotenv').config()
module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./test/setup.ts'],
}
