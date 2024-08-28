const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makePatchTestEnvironmentFromStandbyToReserved(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
) {
  return async function patchTestEnvironmentFromStandbyToReserved(httpRequest) {
    const validHttpRequest = checkHttpRequestIsValidForUiFunctions(httpRequest);
    const { ...testEnvironmentInfo } = validHttpRequest.body;
    const testEnvironmentDataToEdit = {
      ...testEnvironmentInfo,
      status: 'Reserved',
      stage: 'Manual Reservation',
    };

    const [retrievedTestEnvironment] = await dbOperator.findById(httpRequest.params.id, 'testEnvironments');

    const loggingTags = {
      req: httpRequest,
      res: {},
      changes: logger.logFormatter([testEnvironmentDataToEdit]),
      old: logger.logFormatter([retrievedTestEnvironment]),
      service: 'UI Functions (controller)',
      action: 'patchTestEnvironmentFromStandbyToReserved',
      actionParameters: {},
    };

    if (!retrievedTestEnvironment || Object.keys(retrievedTestEnvironment).length === 0) {
      const errorInfo = {
        message: 'Retrieved test environment is undefined or the object is empty',
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new NotFoundError(errorInfo.message);
    }

    loggingTags.actionParameters = { TestEnvironmentName: retrievedTestEnvironment.name };

    const testEnvironmentChanges = testEnvironmentService.updateTestEnvironment([], retrievedTestEnvironment, testEnvironmentDataToEdit);

    if (checkRequestIdExists(retrievedTestEnvironment)) {
      const requestDataToEdit = {
        lastReservedAt: new Date(Date.now()),
        status: 'Unreserved',
      };

      const [requestFromDatabase] = await dbOperator.findById(retrievedTestEnvironment.requestId, 'requests');
      const patchedRequest = requestService.updateRequest(requestFromDatabase, requestDataToEdit);
      await dbOperator.findOneAndUpdate(
        'requests',
        { _id: requestFromDatabase.id },
        patchedRequest,
      );
      testEnvironmentChanges.$set.requestId = '';
    }

    const updatedTestEnvironment = await dbOperator.findOneAndUpdate(
      'testEnvironments',
      { _id: retrievedTestEnvironment.id },
      testEnvironmentChanges,
    );

    if (httpServer.emitter) {
      httpServer.emitter.emit('testEnvironmentEvent', `test environment updated ${updatedTestEnvironment.name}`);
    }

    loggingTags.res = logger.logFormatter([updatedTestEnvironment]);
    logger.info(loggingTags, `PATCH request to update Test Environment object status from Standby to Reserved \
with name:${updatedTestEnvironment.name}.`);

    return updatedTestEnvironment;
  };
}

module.exports = { makePatchTestEnvironmentFromStandbyToReserved };
