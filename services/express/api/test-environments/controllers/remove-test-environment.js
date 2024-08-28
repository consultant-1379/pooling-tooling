function makeDeleteTestEnvironment(
  removeTestEnvironmentIdFromPool, updatePoolViewIndices, updateEnvironmentsViewIndices,
  dbOperator, httpServer, logger,
) {
  return async function deleteTestEnvironment(httpRequest) {
    const [testEnvironmentToRemove] = await dbOperator.findById(httpRequest.params.id, 'testEnvironments');
    await dbOperator.remove({ id: httpRequest.params.id }, 'testEnvironments');

    for (const pool of testEnvironmentToRemove.pools) {
      const [poolToRemoveEnvironmentFrom] = await dbOperator.findBySearchQuery({ poolName: pool }, 'pools');
      const modifiedPoolWithRemovedTestEnvironment = removeTestEnvironmentIdFromPool(poolToRemoveEnvironmentFrom, testEnvironmentToRemove.id);
      await dbOperator.update(modifiedPoolWithRemovedTestEnvironment, 'pools');

      const environmentsToUpdate = await dbOperator.findBySearchQuery({ pools: pool }, 'testEnvironments');
      const modifiedEnvironmentsWithUpdatedPoolIndices = updatePoolViewIndices(
        environmentsToUpdate, modifiedPoolWithRemovedTestEnvironment.poolName, testEnvironmentToRemove,
      );
      for (const modifiedEnvironmentWithUpdatedPoolIndices of modifiedEnvironmentsWithUpdatedPoolIndices) {
        await dbOperator.update(modifiedEnvironmentWithUpdatedPoolIndices, 'testEnvironments');
      }
    }

    if (httpServer.emitter) {
      httpServer.emitter.emit('poolEvent', 'pool updated');
    }

    const testEnvironmentsToUpdate = await dbOperator.findAll('testEnvironments');
    const modifiedEnvironmentsWithUpdatedIndices = updateEnvironmentsViewIndices(testEnvironmentsToUpdate, testEnvironmentToRemove);
    for (const modifiedEnvironmentWithUpdatedIndices of modifiedEnvironmentsWithUpdatedIndices) {
      await dbOperator.update(modifiedEnvironmentWithUpdatedIndices, 'testEnvironments');
    }

    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Test Environment (controller)',
      action: 'deleteTestEnvironment',
      actionParameters: { TestEnvironmentId: testEnvironmentToRemove.id },
    };
    logger.info(loggingTags, `DEL request to remove Test Environment object with ID:${httpRequest.params.id}.`);

    if (httpServer.emitter) {
      httpServer.emitter.emit('testEnvironmentEvent', 'test environment updated');
    }
  };
}

module.exports = { makeDeleteTestEnvironment };
