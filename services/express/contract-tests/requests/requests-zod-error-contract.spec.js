const newman = require('newman');
const expect = require('expect');
const requestsContractTests = require('./Requests.postman_collection_zod_error.json');

const { testSetup } = require('./requests-contract-setup.spec.js');

const { dbOperator } = require('../../data-access/index.js');

describe('Contract Tests: Requests', () => {
  let testSetupObject;
  before(async () => {
    testSetupObject = await testSetup();
  });

  it('should run requests contract tests', (done) => {
    const environmentVariablesForContractTests = [
      {
        key: 'REQUEST_ONE_ID', value: testSetupObject.requests[0].id,
      },
    ];

    newman.run({
      collection: requestsContractTests,
      reporters: 'cli',
      envVar: environmentVariablesForContractTests,
    }, (err, summary) => {
      expect(summary.run.failures.length).toBe(0);
      done();
    });
  });

  after(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('pools');
  });
});
