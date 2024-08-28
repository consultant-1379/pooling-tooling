const { makeFakeTestEnvironment } = require('../../__test__/fixtures/test-environment.spec.js');
const { makeFakePool } = require('../../__test__/fixtures/pool.spec.js');

const { dbOperator } = require('../../data-access');

async function testSetup() {
  const availableTestEnvironment = makeFakeTestEnvironment({
    status: 'Available',
    pools: ['myPool'],
  });

  const testEnvironmentWithLowVersion = makeFakeTestEnvironment({
    properties: {
      version: '1.1.1',
    },
  });
  const testEnvironmentWithHighVersion = makeFakeTestEnvironment({
    properties: {
      version: '2.2.2',
    },
  });

  const fakePool = makeFakePool({
    poolName: 'myPool',
    assignedTestEnvironmentIds: [availableTestEnvironment.id],
  });

  await dbOperator.insert(fakePool, 'pools');
  await dbOperator.insert(availableTestEnvironment, 'testEnvironments');
  await dbOperator.insert(testEnvironmentWithLowVersion, 'testEnvironments');
  await dbOperator.insert(testEnvironmentWithHighVersion, 'testEnvironments');

  return {
    testEnvironments: [availableTestEnvironment, testEnvironmentWithLowVersion, testEnvironmentWithHighVersion],
    pools: [fakePool],
  };
}

module.exports = { testSetup };
