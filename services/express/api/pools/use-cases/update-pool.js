const { BadRequestError } = require('../../../interfaces/BadRequestError');
const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeUpdatePool(logger, flattenObject) {
  function updatePoolEntity(changes) {
    if (changes.createdOn) {
      delete changes.createdOn;
    }
    if (changes.id) {
      delete changes.id;
    }
    if (changes.creatorDetails) {
      const flattenedCreatorDetails = flattenObject(
        changes.creatorDetails,
        'creatorDetails',
      );
      delete changes.creatorDetails;
      changes = { ...changes, ...flattenedCreatorDetails };
    }
    if (
      changes.assignedTestEnvironmentIds
      && changes.assignedTestEnvironmentIds.length === 0
    ) {
      throw new BadRequestError(
        'Pool entity must use array for assignedTestEnvironmentIds.',
      );
    }
    changes.modifiedOn = new Date();
    changes = { $set: changes };
    if (changes.$set.testEnvironmentIdsToAdd) {
      changes.$push = {
        assignedTestEnvironmentIds: {
          $each: Object.values(changes.$set.testEnvironmentIdsToAdd),
        },
      };
      delete changes.$set.testEnvironmentIdsToAdd;
    }
    if (changes.$set.testEnvironmentIdsToRemove) {
      changes.$pull = {
        assignedTestEnvironmentIds: {
          $in: Object.values(changes.$set.testEnvironmentIdsToRemove),
        },
      };
      delete changes.$set.testEnvironmentIdsToRemove;
    }
    return changes;
  }

  return function updatePool([existingPool], changes) {
    const loggingTags = {
      service: 'Pools (use-cases)',
      action: 'updatePool',
      actionParameters: { PoolsChanges: changes },
    };
    try {
      if (!existingPool) {
        const errorInfo = {
          message: 'Pool not found',
        };
        logger.error(
          { errorInfo, loggingTags },
          `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
        );
        throw new NotFoundError(errorInfo.message);
      }

      const updates = updatePoolEntity({ ...changes });

      logger.info(
        loggingTags,
        `Pool object with name:${existingPool.name} is successfully updated.`,
      );

      return updates;
    } catch (error) {
      logger.error(
        { errorInfo: { message: `${error.message}` }, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
      throw error;
    }
  };
}

module.exports = { makeUpdatePool };
