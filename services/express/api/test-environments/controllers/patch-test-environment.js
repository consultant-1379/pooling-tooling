const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makePatchTestEnvironment(
  getTestEnvironmentById,
  modifyTestEnvironment,
  determinePoolsToAddAndRemoveTestEnvironmentsFrom,
  addTestEnvironmentNameToPool,
  removeTestEnvironmentNameFromPool,
  updatePool,
  dbOperator,
  httpServer,
  logger,
) {
  return async function patchTestEnvironment(httpRequest) {
    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Test Environment (controller)',
      action: 'patchTestEnvironment',
      actionParameters: {},
    };
    const changes = httpRequest.body;
    const { id } = httpRequest.params;
    try {
      const testEnvironmentWithSameName = await dbOperator.findBySearchQuery(
        { name: changes.name },
        'testEnvironments',
      );

      const [retrievedTestEnvironment] = await dbOperator.findById(
        id,
        'testEnvironments',
      );

      const existingTestEnvironment = getTestEnvironmentById(
        retrievedTestEnvironment,
      );

      if (!existingTestEnvironment) {
        throw new NotFoundError('Test Environment not found');
      }

      loggingTags.old = logger.logFormatter([existingTestEnvironment]);

      const updatedChanges = modifyTestEnvironment(
        testEnvironmentWithSameName,
        existingTestEnvironment,
        changes,
      );
      loggingTags.changes = logger.logFormatter([updatedChanges]);
      if (Object.prototype.hasOwnProperty.call(changes, 'pools')) {
        const poolsToAddAndRemoveTestEnvironmentsFrom = determinePoolsToAddAndRemoveTestEnvironmentsFrom(
          retrievedTestEnvironment.pools,
          updatedChanges.$set.pools,
        );
        if (poolsToAddAndRemoveTestEnvironmentsFrom) {
          for (const pool of poolsToAddAndRemoveTestEnvironmentsFrom.poolsToAddTestEnvironmentTo) {
            const [poolToAddEnvironmentTo] = await dbOperator.findBySearchQuery(
              { poolName: pool },
              'pools',
            );
            const updatedPoolWithTestEnvIdAdded = updatePool(
              [poolToAddEnvironmentTo],
              {
                testEnvironmentIdsToAdd: [id],
              },
            );
            const updatedPool = await dbOperator.findOneAndUpdate(
              'pools',
              { poolName: pool },
              updatedPoolWithTestEnvIdAdded,
            );

            const loggingTagsForPoolsUpdate = {
              poolName: poolToAddEnvironmentTo.poolName,
              oldTestEnvAssignedId:
                poolToAddEnvironmentTo.assignedTestEnvironmentIds,
              newTestEnvAssignedId:
                updatedPool.assignedTestEnvironmentIds,
              service: 'Test Environment (controller)',
              action: 'patchTestEnvironment: updatePools',
              subAction: 'testEnvironmentIdAdded',
              actionParameters: poolsToAddAndRemoveTestEnvironmentsFrom,
            };
            logger.info(
              loggingTagsForPoolsUpdate,
              `Update to ${updatedPoolWithTestEnvIdAdded.poolName} Pool object. \
            The assigned test environment IDs: ${updatedPoolWithTestEnvIdAdded.assignedTestEnvironmentIds}`,
            );
          }
          for (const pool of poolsToAddAndRemoveTestEnvironmentsFrom.poolsToRemoveTestEnvironmentFrom) {
            const [poolToRemoveEnvironmentFrom] = await dbOperator.findBySearchQuery(
              { poolName: pool },
              'pools',
            );
            const updatedPoolWithTestEnvIdRemoved = updatePool(
              [poolToRemoveEnvironmentFrom],
              {
                testEnvironmentIdsToRemove: [id],
              },
            );
            const updatedPool = await dbOperator.findOneAndUpdate(
              'pools',
              { poolName: pool },
              updatedPoolWithTestEnvIdRemoved,
            );
            const loggingTagsForPoolsUpdate = {
              poolName: poolToRemoveEnvironmentFrom.poolName,
              oldTestEnvAssignedId:
              updatedPool.assignedTestEnvironmentIds,
              newTestEnvAssignedId:
                updatedPoolWithTestEnvIdRemoved.assignedTestEnvironmentIds,
              service: 'Test Environment (controller)',
              action: 'patchTestEnvironment: updatePools',
              subAction: 'testEnvironmentRemoved',
              actionParameters: poolsToAddAndRemoveTestEnvironmentsFrom,
            };
            logger.info(
              loggingTagsForPoolsUpdate,
              `Update to ${updatedPoolWithTestEnvIdRemoved.poolName} Pool object. \
                The assigned test environment IDs: ${updatedPoolWithTestEnvIdRemoved.assignedTestEnvironmentIds}.`,
            );
          }
        }
      }

      const result = await dbOperator.findOneAndUpdate(
        'testEnvironments',
        { _id: id },
        updatedChanges,
      );
      loggingTags.res = logger.logFormatter([result]);
      loggingTags.actionParameters = {
        TestEnvironmentName: result.name,
      };

      if (httpServer.emitter) {
        httpServer.emitter.emit(
          'testEnvironmentEvent',
          `test environment updated ${result.name}`,
        );
      }

      logger.info(
        loggingTags,
        `PATCH request to update Test Environment object with name:${result.name}}.`,
      );

      return result;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };
      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
      throw error;
    }
  };
}

module.exports = { makePatchTestEnvironment };
