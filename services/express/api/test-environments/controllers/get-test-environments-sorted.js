function makeGetTestEnvironmentsSorted(testEnvironmentDb, logger) {
  return async function getTestEnvironmentsSorted() {
    const retrievedTestEnvironments = await testEnvironmentDb.findAllSorted('testEnvironments', (testEnvironment, otherTestEnvironment) => {
      if (
        testEnvironment.priorityInfo.viewIndices.testEnvironmentViewIndex < otherTestEnvironment.priorityInfo.viewIndices.testEnvironmentViewIndex
      ) {
        return -1;
      }
      if (
        testEnvironment.priorityInfo.viewIndices.testEnvironmentViewIndex > otherTestEnvironment.priorityInfo.viewIndices.testEnvironmentViewIndex
      ) {
        return 1;
      }
      return 0;
    });
    const loggingTags = {
      req: {},
      res: {},
      service: 'Test Environment (controller)',
      action: 'getTestEnvironmentsSorted',
      actionParameters: {},
    };
    logger.info(loggingTags, `GET request to retrieve all the Test Environment objects sorted. \
${retrievedTestEnvironments.length} test environment(s) retrieved`);
    return retrievedTestEnvironments;
  };
}

module.exports = { makeGetTestEnvironmentsSorted };
