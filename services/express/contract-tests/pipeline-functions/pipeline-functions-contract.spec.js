const newman = require('newman');
const expect = require('expect');
const pipelineFunctionsContractTests = require('./PipelineFunctions.postman_collection.json');

const { testSetup } = require('./pipeline-functions-contract-setup.spec.js');

const { dbOperator } = require('../../data-access');

describe('Contract Tests: Pipeline Functions', () => {
  let testSetupObject;
  before(async () => {
    testSetupObject = await testSetup();
  });

  it('should run pipeline-functions contract tests', (done) => {
    const environmentVariablesForContractTests = [
      {
        key: 'REQUEST_WITH_QUEUED_STATUS_ID', value: testSetupObject.requests[0].id,
      },
      {
        key: 'NAME_OF_TEST_ENVIRONMENT_ONE_WITH_RESERVED_STATUS', value: testSetupObject.testEnvironments[0].name,
      },
      {
        key: 'NAME_OF_TEST_ENVIRONMENT_TWO_WITH_RESERVED_STATUS', value: testSetupObject.testEnvironments[1].name,
      },
      {
        key: 'NAME_OF_TEST_ENVIRONMENT_WITH_STANDBY_STATUS', value: testSetupObject.testEnvironments[2].name,
      },
    ];

    newman.run({
      collection: pipelineFunctionsContractTests,
      reporters: 'cli',
      envVar: environmentVariablesForContractTests,
    }, (err, summary) => {
      expect(summary.run.failures.length).toBe(0);
      done();
    });
  });

  after(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('testEnvironments');
  });
});
