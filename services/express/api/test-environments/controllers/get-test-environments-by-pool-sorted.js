function makeGetTestEnvironmentsByPoolSorted(testEnvironmentDb, logger) {
  return async function getTestEnvironmentsByPoolSorted(httpRequest) {
    const { pool } = httpRequest.params;
    const retrievedTestEnvironments = await testEnvironmentDb
      .findBySearchQuerySorted({ pools: pool }, 'testEnvironments', (testEnvironment, otherTestEnvironment) => {
        if (testEnvironment.priorityInfo.viewIndices[pool] < otherTestEnvironment.priorityInfo.viewIndices[pool]) {
          return -1;
        }
        if (testEnvironment.priorityInfo.viewIndices[pool] > otherTestEnvironment.priorityInfo.viewIndices[pool]) {
          return 1;
        }
        return 0;
      });
    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Test Environment (controller)',
      action: 'getTestEnvironmentsByPoolSorted',
      actionParameters: { PoolName: pool },
    };
    logger.info(loggingTags, `GET request to retrieve sorted Test Environments from pool "${pool}". \
${retrievedTestEnvironments.length} test environment(s) retrieved`);
    return retrievedTestEnvironments;
  };
}

module.exports = { makeGetTestEnvironmentsByPoolSorted };
