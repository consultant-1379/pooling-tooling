const { BadRequestError } = require('../../../interfaces/BadRequestError');
const { ConflictError } = require('../../../interfaces/ConflictError');
const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeUpdateTestEnvironment(logger, flattenObject) {
  function updateTestEnvironmentEntity(changes) {
    if (changes.createdOn) {
      delete changes.createdOn;
    }
    if (changes.id) {
      delete changes.id;
    }
    if (changes.properties) {
      const flattenedProperties = flattenObject(changes.properties, 'properties');
      delete changes.properties;
      changes = { ...changes, ...flattenedProperties };
    }
    if (changes.priorityInfo) {
      const flattenedPriorityInfo = flattenObject(changes.priorityInfo, 'priorityInfo');
      delete changes.priorityInfo;
      changes = { ...changes, ...flattenedPriorityInfo };
    }
    if (changes.pools && changes.pools.length === 0) {
      throw new BadRequestError('No pools were provided when making test environment');
    }

    changes.modifiedOn = new Date();

    return { $set: changes };
  }

  return function updateTestEnvironment(
    testEnvironmentWithSameNameAsTestEnvironmentToUpdate,
    existingTestEnvironment,
    changes,
  ) {
    const loggingTags = {
      service: 'Test Environment (use-cases)',
      action: 'updateTestEnvironmentEntity',
      actionParameters: { TestEnvironmentChanges: changes },
    };
    try {
      if (!existingTestEnvironment) {
        throw new NotFoundError('Test Environment not found');
      }

      if (
        changes.name
        && testEnvironmentWithSameNameAsTestEnvironmentToUpdate.length > 0
        && testEnvironmentWithSameNameAsTestEnvironmentToUpdate[0].id
          !== existingTestEnvironment.id
      ) {
        throw new ConflictError(
          `A test environment named ${changes.name} already exists. Can not update test environment with the same name.`,
        );
      }

      return updateTestEnvironmentEntity({ ...changes });
    } catch (error) {
      logger.error(
        { errorInfo: { message: `${error.message}` }, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
      throw error;
    }
  };
}

module.exports = { makeUpdateTestEnvironment };
