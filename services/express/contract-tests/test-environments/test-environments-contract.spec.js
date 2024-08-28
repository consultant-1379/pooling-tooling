const newman = require('newman');
const expect = require('expect');
const testEnvironmentContractTests = require('./TestEnvironments.postman_collection.json');

const { testSetup } = require('./test-environments-contract-setup.spec.js');

const { dbOperator } = require('../../data-access');

describe('Contract Tests: Test Environments', () => {
  let testSetupObject;
  before(async () => {
    testSetupObject = await testSetup();
  });

  it('should run test-environments contract tests', (done) => {
    const environmentVariablesForContractTests = [
      {
        key: 'TEST_ENVIRONMENT_ONE_ID', value: testSetupObject.testEnvironments[0].id,
      },
      {
        key: 'TEST_ENVIRONMENT_ONE_NAME', value: testSetupObject.testEnvironments[0].name,
      },
      {
        key: 'TEST_ENVIRONMENT_ONE_STATUS', value: testSetupObject.testEnvironments[0].status,
      },
      {
        key: 'TEST_ENVIRONMENT_ONE_POOL', value: testSetupObject.testEnvironments[0].pools[0],
      },
      {
        key: 'TEST_ENVIRONMENT_WITH_LOW_VERSION_ID', value: testSetupObject.testEnvironments[1].id,
      },
      {
        key: 'TEST_ENVIRONMENT_WITH_HIGH_VERSION_ID', value: testSetupObject.testEnvironments[2].id,
      },
    ];

    newman.run({
      collection: testEnvironmentContractTests,
      reporters: 'cli',
      envVar: environmentVariablesForContractTests,
    }, (err, summary) => {
      expect(summary.run.failures.length).toBe(0);
      done();
    });
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
});
