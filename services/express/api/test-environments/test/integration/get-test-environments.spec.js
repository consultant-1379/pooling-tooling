const expect = require('expect');

const { getTestEnvironments } = require('../../controllers');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Test Environment service) Get test environments', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });

  it('should successfully get test environments from the database', async () => {
    const retrievedTestEnvironmentOne = await getTestEnvironments();
    expect(retrievedTestEnvironmentOne).toHaveLength(0);
    const fakeTestEnvironment = makeFakeTestEnvironment();
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    const retrievedTestEnvironmentTwo = await getTestEnvironments();
    expect(retrievedTestEnvironmentTwo).toHaveLength(1);
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
});
