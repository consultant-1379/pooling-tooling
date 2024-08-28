function makeGetFreshestTestEnvironment(testEnvironmentDb, sortTestEnvironmentsByVersion, logger) {
  return async function getFreshestTestEnvironment(input) {
    let testEnvironmentIds = [];

    if (Array.isArray(input)) {
      testEnvironmentIds = input;
    } else {
      testEnvironmentIds = input.params.ids.split(',');
    }

    const retrievedTestEnvironments = [];

    for (const testEnvironmentId of testEnvironmentIds) {
      await testEnvironmentDb.findById(testEnvironmentId, 'testEnvironments')
        .then((testEnvironment) => {
          retrievedTestEnvironments.push(testEnvironment[0]);
        });
    }
    const [freshestTestEnvironment] = sortTestEnvironmentsByVersion(retrievedTestEnvironments);

    let loggingTags = {
      service: 'Test Environment (controller)',
      action: 'getFreshestTestEnvironment',
      actionParameters: { TestEnvironmentIds: testEnvironmentIds },
    };
    const loggingTagsForHttpRequest = {
      req: input,
      res: logger.logFormatter([freshestTestEnvironment]),
    };

    if (!Array.isArray(input)) {
      loggingTags = { ...loggingTagsForHttpRequest, ...loggingTags };
    }
    logger.info(loggingTags, 'Returning freshest test environment by version.');

    return freshestTestEnvironment;
  };
}

module.exports = { makeGetFreshestTestEnvironment };
