function makePostTestEnvironment(createTestEnvironment, addTestEnvironmentIdToPool, dbOperator, httpServer, logger) {
  return async function postTestEnvironment(httpRequest) {
    const { ...testEnvironmentInfo } = httpRequest.body;

    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Test Environment (controller)',
      action: 'postTestEnvironment',
      actionParameters: {},
    };

    try {
      const testEnvironmentWithSameName = await dbOperator.findBySearchQuery({ name: testEnvironmentInfo.name }, 'testEnvironments');

      const createdTestEnvironment = createTestEnvironment(testEnvironmentWithSameName, { ...testEnvironmentInfo });

      for (const pool of httpRequest.body.pools) {
        const [poolToAddEnvironmentTo] = await dbOperator.findBySearchQuery({ poolName: pool }, 'pools');
        const modifiedPoolWithAddedTestEnvironment = addTestEnvironmentIdToPool(poolToAddEnvironmentTo, createdTestEnvironment.id);
        await dbOperator.update(modifiedPoolWithAddedTestEnvironment, 'pools');

        createdTestEnvironment.priorityInfo.viewIndices[pool] = modifiedPoolWithAddedTestEnvironment.assignedTestEnvironmentIds.length - 1;
      }

      const testEnvironments = await dbOperator.findAll('testEnvironments');
      createdTestEnvironment.priorityInfo.viewIndices.testEnvironmentViewIndex = testEnvironments.length;

      const postedTestEnvironment = await dbOperator.insert(createdTestEnvironment, 'testEnvironments');

      if (httpServer.emitter) {
        httpServer.emitter.emit('testEnvironmentEvent', 'test environment updated');
      }

      loggingTags.res = logger.logFormatter([postedTestEnvironment]);
      loggingTags.actionParameters = { TestEnvironmentName: testEnvironmentInfo.name };

      logger.info(loggingTags, `POST request to create Test Environment object with name:${testEnvironmentInfo.name}.`);

      return postedTestEnvironment;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };

      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}: ${error.message}`,
      );

      throw error;
    }
  };
}

module.exports = { makePostTestEnvironment };
