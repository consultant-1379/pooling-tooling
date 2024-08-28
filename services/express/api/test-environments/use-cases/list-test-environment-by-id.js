const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeListTestEnvironmentById() {
  return function listTestEnvironmentById(existingTestEnvironment) {
    if (!existingTestEnvironment) {
      throw new NotFoundError('Test Environment not found');
    }
    return existingTestEnvironment;
  };
}

module.exports = { makeListTestEnvironmentById };
