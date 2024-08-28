const events = require('events');
const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makePatchTestEnvironmentFromStandbyToAvailable(
  dbOperator,
  testEnvironmentService,
  logger,
) {
  return async function patchTestEnvironmentFromStandbyToAvailable(
    httpRequest,
  ) {
    const testEnvironmentDataToEdit = {
      status: 'Available',
      additionalInfo: '',
    };

    const emitter = new events.EventEmitter();

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
      action: 'patchTestEnvironmentFromStandbyToAvailable',
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
    const updatedTestEnvironment = await dbOperator.findOneAndUpdate(
      'testEnvironments',
      { _id: retrievedTestEnvironment.id },
      testEnvironmentChanges,
    );

    if (emitter) {
      emitter.emit('testEnvironmentEvent', `test environment updated ${testEnvironmentName}`);
    }

    loggingTags.res = logger.logFormatter([updatedTestEnvironment]);
    logger.info(
      loggingTags,
      `PATCH request to update Test Environment object status from Standby to Available with name :${testEnvironmentName}.`,
    );

    return updatedTestEnvironment;
  };
}

module.exports = { makePatchTestEnvironmentFromStandbyToAvailable };
