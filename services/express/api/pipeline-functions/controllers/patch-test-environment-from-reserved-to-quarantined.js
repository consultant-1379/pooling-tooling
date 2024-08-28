const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makePatchTestEnvironmentFromReservedToQuarantined(
  testEnvironmentService,
  testEnvironmentDb,
  httpServer,
  logger,
) {
  return async function patchTestEnvironmentFromReservedToQuarantined(httpRequest) {
    const testEnvironmentDataToEdit = {
      additionalInfo: 'Quarantined by Pipeline',
      status: 'Quarantine',
    };

    const testEnvironmentName = httpRequest.params.name;
    const [retrievedTestEnvironment] = await testEnvironmentDb.findBySearchQuery({
      name: testEnvironmentName,
    }, 'testEnvironments');

    const loggingTags = {
      req: httpRequest,
      res: {},
      changes: logger.logFormatter([testEnvironmentDataToEdit]),
      old: logger.logFormatter([retrievedTestEnvironment]),
      service: 'Pipeline Functions (controller)',
      action: 'patchTestEnvironmentFromReservedToQuarantined',
      actionParameters: { TestEnvironmentName: testEnvironmentName },
    };

    if (!retrievedTestEnvironment || Object.keys(retrievedTestEnvironment).length === 0) {
      const errorInfo = {
        message: 'Retrieved test environment is undefined or the object is empty',
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new NotFoundError(errorInfo.message);
    }

    const testEnvironmentChanges = testEnvironmentService.updateTestEnvironment([], retrievedTestEnvironment, testEnvironmentDataToEdit);

    const updatedTestEnvironment = await testEnvironmentDb.findOneAndUpdate(
      'testEnvironments',
      { _id: retrievedTestEnvironment.id },
      testEnvironmentChanges,
    );

    if (httpServer.emitter) {
      httpServer.emitter.emit('testEnvironmentEvent', `test environment updated ${testEnvironmentName}`);
    }

    loggingTags.res = logger.logFormatter([updatedTestEnvironment]);

    logger.info(loggingTags,
      `PATCH request to update Test Environment object status from Reserved to Quarantine with name :${testEnvironmentName}.`);

    return updatedTestEnvironment;
  };
}

module.exports = { makePatchTestEnvironmentFromReservedToQuarantined };
