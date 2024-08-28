const expect = require('expect');

const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { dbOperator } = require('../../../../data-access');
const { getTestEnvironmentsByPoolSorted } = require('../../controllers');

describe('Integration Test: (Test Environment service) Get test environments by pool controller sorted', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
  it('successfully gets test environments in a given pool', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['testPool1'] });
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ pools: ['testPool2'] });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');
    const fakeHttpRequest = {
      params: {
        pool: fakeTestEnvironment.pools,
      },
    };

    const [testEnvironmentsByPool] = await getTestEnvironmentsByPoolSorted(fakeHttpRequest);
    expect(testEnvironmentsByPool.pools).toEqual(fakeTestEnvironment.pools);
    expect(testEnvironmentsByPool.pools).not.toStrictEqual(fakeTestEnvironment1.pools);
  });

  it('successfully gets test environments in a given pool sorted', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['testPool1'], priorityInfo: { viewIndices: { testPool1: 1 } } });
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ pools: ['testPool1'], priorityInfo: { viewIndices: { testPool1: 0 } } });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');
    const fakeHttpRequest = {
      params: {
        pool: fakeTestEnvironment.pools,
      },
    };

    const testEnvironmentsByPool = await getTestEnvironmentsByPoolSorted(fakeHttpRequest);
    expect(testEnvironmentsByPool[0]).toEqual(fakeTestEnvironment1);
    expect(testEnvironmentsByPool[1]).toEqual(fakeTestEnvironment);
  });

  it('successfully gets test environments in a given pool sorted with multiple pools', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['testPool1', 'testPool2'], priorityInfo: { viewIndices: { testPool1: 1, testPool2: 0 } } });
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ pools: ['testPool1', 'testPool2'], priorityInfo: { viewIndices: { testPool1: 0, testPool2: 1 } } });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');
    const fakeHttpRequest = {
      params: {
        pool: fakeTestEnvironment.pools[0],
      },
    };

    const testEnvironmentsByPool = await getTestEnvironmentsByPoolSorted(fakeHttpRequest);
    expect(testEnvironmentsByPool[0]).toEqual(fakeTestEnvironment1);
    expect(testEnvironmentsByPool[1]).toEqual(fakeTestEnvironment);

    const otherFakeHttpRequest = {
      params: {
        pool: fakeTestEnvironment.pools[1],
      },
    };

    const otherTestEnvironmentsByPool = await getTestEnvironmentsByPoolSorted(otherFakeHttpRequest);
    expect(otherTestEnvironmentsByPool[0]).toEqual(fakeTestEnvironment);
    expect(otherTestEnvironmentsByPool[1]).toEqual(fakeTestEnvironment1);
  });

  it('returns empty if no test environments are assigned to the pool', async () => {
    const fakeHttpRequest = {
      params: {
        pool: 'dummy',
      },
    };
    const testEnvironmentsByPool = await getTestEnvironmentsByPoolSorted(fakeHttpRequest);
    expect(testEnvironmentsByPool).toEqual([]);
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
});
