const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makePatchTestEnvironmentFromReservedToAvailable(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkRequestIdExists,
  httpServer,
  logger,
) {
  return async function patchTestEnvironmentFromReservedToAvailable(
    httpRequest,
  ) {
    const testEnvironmentDataToEdit = {
      status: 'Available',
      additionalInfo: '',
      stage: '',
    };

    const testEnvironmentName = httpRequest.params.name;
    const [retrievedTestEnvironment] = await dbOperator.findBySearchQuery(
      {
        name: testEnvironmentName,
      },
      'testEnvironments',
    );
    const loggingTags = {
      req: httpRequest,
      res: {},
      changes: logger.logFormatter([testEnvironmentDataToEdit]),
      old: logger.logFormatter([retrievedTestEnvironment]),
      service: 'Pipeline Functions (controller)',
      action: 'patchTestEnvironmentFromReservedToAvailable',
      actionParameters: { TestEnvironmentName: testEnvironmentName },
    };

    if (
      !retrievedTestEnvironment
      || Object.keys(retrievedTestEnvironment).length === 0
    ) {
      const errorInfo = {
        message:
          'Retrieved test environment is undefined or the object is empty',
      };
      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
      throw new NotFoundError(errorInfo.message);
    }
    const testEnvironmentChanges = testEnvironmentService.updateTestEnvironment(
      [],
      retrievedTestEnvironment,
      testEnvironmentDataToEdit,
    );
    if (checkRequestIdExists(retrievedTestEnvironment)) {
      const requestDataToEdit = {
        lastReservedAt: new Date(Date.now()),
        status: 'Unreserved',
      };

      const [requestFromDatabase] = await dbOperator.findById(
        retrievedTestEnvironment.requestId,
        'requests',
      );
      const patchedRequest = requestService.updateRequest(
        requestFromDatabase,
        requestDataToEdit,
      );
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
      httpServer.emitter.emit(
        'testEnvironmentEvent',
        `test environment updated ${testEnvironmentName}`,
      );
    }

    loggingTags.res = logger.logFormatter([updatedTestEnvironment]);
    logger.info(
      loggingTags,
      `PATCH request to update Test Environment object status from Reserved to Available with name :${testEnvironmentName}.`,
    );

    return updatedTestEnvironment;
  };
}

module.exports = { makePatchTestEnvironmentFromReservedToAvailable };
