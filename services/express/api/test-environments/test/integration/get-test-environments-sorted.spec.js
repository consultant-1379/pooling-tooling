const expect = require('expect');

const { getTestEnvironmentsSorted } = require('../../controllers');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Test Environment service) Get test environments sorted', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });

  it('should successfully get test environments from the database', async () => {
    const retrievedTestEnvironmentOne = await getTestEnvironmentsSorted();
    expect(retrievedTestEnvironmentOne).toHaveLength(0);
    const fakeTestEnvironment = makeFakeTestEnvironment();
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    const retrievedTestEnvironmentTwo = await getTestEnvironmentsSorted();
    expect(retrievedTestEnvironmentTwo).toHaveLength(1);
  });

  it('successfully gets test environments sorted where first environment to be sorted higher', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['testPool1'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 0 } } });
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ pools: ['testPool1'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 1 } } });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');

    const testEnvironmentsSorted = await getTestEnvironmentsSorted();

    expect(testEnvironmentsSorted[0]).toEqual(fakeTestEnvironment);
    expect(testEnvironmentsSorted[1]).toEqual(fakeTestEnvironment1);
  });

  it('successfully gets test environments sorted where second environment to be sorted higher', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['testPool1'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 1 } } });
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ pools: ['testPool1'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 0 } } });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');

    const testEnvironmentsSorted = await getTestEnvironmentsSorted();

    expect(testEnvironmentsSorted[0]).toEqual(fakeTestEnvironment1);
    expect(testEnvironmentsSorted[1]).toEqual(fakeTestEnvironment);
  });

  it('successfully gets test environments sorted if view indices are the same', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['testPool1'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 0 } } });
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ pools: ['testPool1'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 0 } } });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');

    const testEnvironmentsSorted = await getTestEnvironmentsSorted();

    expect(testEnvironmentsSorted[0]).toEqual(fakeTestEnvironment);
    expect(testEnvironmentsSorted[1]).toEqual(fakeTestEnvironment1);
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
});
