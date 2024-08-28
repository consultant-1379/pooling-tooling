const { makeFakeRequest } = require('../../__test__/fixtures/request.spec.js');
const { makeFakeTestEnvironment } = require('../../__test__/fixtures/test-environment.spec.js');

const { dbOperator } = require('../../data-access');

async function testSetup() {
  const requestWithQueuedStatus = makeFakeRequest({
    status: 'Queued',
  });

  const testEnvironmentOneWithReservedStatus = makeFakeTestEnvironment({
    status: 'Reserved',
  });

  const testEnvironmentTwoWithReservedStatus = makeFakeTestEnvironment({
    status: 'Reserved',
    requestId: '',
  });

  const testEnvironmentWithStandbyStatus = makeFakeTestEnvironment({
    status: 'Standby',
  });

  await dbOperator.insert(requestWithQueuedStatus, 'requests');
  await dbOperator.insert(testEnvironmentOneWithReservedStatus, 'testEnvironments');
  await dbOperator.insert(testEnvironmentTwoWithReservedStatus, 'testEnvironments');
  await dbOperator.insert(testEnvironmentWithStandbyStatus, 'testEnvironments');

  return {
    requests: [requestWithQueuedStatus],
    testEnvironments: [testEnvironmentOneWithReservedStatus, testEnvironmentTwoWithReservedStatus, testEnvironmentWithStandbyStatus],
  };
}

module.exports = { testSetup };
