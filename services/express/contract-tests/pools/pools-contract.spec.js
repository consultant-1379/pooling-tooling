const newman = require('newman');
const expect = require('expect');
const poolsContractTests = require('./Pools.postman_collection.json');

const { testSetup } = require('./pools-contract-setup.spec.js');

const { dbOperator } = require('../../data-access');

describe('Contract Tests: Pools', () => {
  let testSetupObject;
  before(async () => {
    testSetupObject = await testSetup();
  });

  it('should run pools contract tests', (done) => {
    const environmentVariablesForContractTests = [
      {
        key: 'POOL_ONE_ID', value: testSetupObject.pools[0].id,
      },
      {
        key: 'POOL_ONE_NAME', value: testSetupObject.pools[0].poolName,
      },
    ];

    newman.run({
      collection: poolsContractTests,
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
