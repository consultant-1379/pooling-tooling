const expect = require('expect');

const { postTestEnvironment } = require('../../controllers');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { makePostTestEnvironment } = require('../../controllers/post-test-environment');
const { createNewTestEnvironment, addTestEnvironmentIdToPool } = require('../../use-cases');
const { dbOperator } = require('../../../../data-access');

const logger = require('../../../../logger/logger');

describe('Integration Test: (Test Environment service) Create test environment', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });

  it('should successfully create a test environment in the database', async () => {
    const fakePool = makeFakePool({ poolName: 'myPool' });
    await dbOperator.insert(fakePool, 'pools');
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPool'] });
    const actualPostedTestEnvironment = await postTestEnvironment({ body: fakeTestEnvironment });
    const testEnvironmentFromDb = await dbOperator.findAll('testEnvironments');
    expect(testEnvironmentFromDb).toHaveLength(1);
    const [testEnvironmentInDb] = testEnvironmentFromDb;

    Object.keys(actualPostedTestEnvironment).forEach((key) => {
      expect(actualPostedTestEnvironment[key]).toEqual(testEnvironmentInDb[key]);
    });
  });

  it('should not create a test environment in the database if an error is thrown in the e2e flow of test environment creation', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ id: 'INVALID' });
    const expectedErrorMessage = 'Test Environment entity must have a valid id.';
    let actualErrorMessage;
    await postTestEnvironment({ body: fakeTestEnvironment }).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('should not allow more than one test environment with the same name in the e2e flow of test environment creation', async () => {
    const fakePool = makeFakePool({ poolName: 'myPool' });
    await dbOperator.insert(fakePool, 'pools');
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({ name: 'DUPLICATE_NAME', pools: ['myPool'] });
    const fakeTestEnvironmentTwo = makeFakeTestEnvironment({ name: 'DUPLICATE_NAME', pools: ['myPool'] });
    await postTestEnvironment({ body: fakeTestEnvironmentOne });

    const expectedErrorMessage = 'A test environment named DUPLICATE_NAME already exists. Not creating new test environment.';
    let actualErrorMessage;
    await postTestEnvironment({ body: fakeTestEnvironmentTwo }).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('successfully modifies the assignedTestEnvironmentIds of a pool (One pool specified)', async () => {
    const fakePool = makeFakePool({ poolName: 'myPool', assignedTestEnvironmentIds: [] });
    await dbOperator.insert(fakePool, 'pools');
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPool'] });
    const firstCheckOfPoolsDb = await dbOperator.findAll('pools');
    expect(firstCheckOfPoolsDb).toHaveLength(1);
    expect(firstCheckOfPoolsDb[0].assignedTestEnvironmentIds).toEqual([]);
    await postTestEnvironment({ body: fakeTestEnvironment });
    const secondCheckOfPoolsDb = await dbOperator.findAll('pools');
    expect(secondCheckOfPoolsDb[0].assignedTestEnvironmentIds).toContain(fakeTestEnvironment.id);
  });

  it('successfully modifies the assignedTestEnvironmentIds of a pool (Two pools specified)', async () => {
    const fakePoolOne = makeFakePool({ poolName: 'myPoolOne', assignedTestEnvironmentIds: [] });
    const fakePoolTwo = makeFakePool({ poolName: 'myPoolTwo', assignedTestEnvironmentIds: ['I_ALREADY_CONTAIN_SOMETHING'] });
    await dbOperator.insert(fakePoolOne, 'pools');
    await dbOperator.insert(fakePoolTwo, 'pools');
    const firstCheckOfPoolsDb = await dbOperator.findAll('pools');
    expect(firstCheckOfPoolsDb).toHaveLength(2);

    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPoolOne', 'myPoolTwo'] });
    await postTestEnvironment({ body: fakeTestEnvironment });
    const secondCheckOfPoolsDb = await dbOperator.findAll('pools');
    expect(secondCheckOfPoolsDb[0].assignedTestEnvironmentIds).toContain(fakeTestEnvironment.id);
    expect(secondCheckOfPoolsDb[1].assignedTestEnvironmentIds).toContain('I_ALREADY_CONTAIN_SOMETHING');
    expect(secondCheckOfPoolsDb[1].assignedTestEnvironmentIds).toContain(fakeTestEnvironment.id);
  });

  it('should throw an error if the specified pool tied to a test environment does not exist when trying to create a pool', async () => {
    const fakePool = makeFakePool({ poolName: 'myPool' });
    await dbOperator.insert(fakePool, 'pools');
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['I_DONT_EXIST'] });
    const expectedErrorMessage = `Can't find pool you wish to add test environment ${fakeTestEnvironment.id} to.`;
    let actualErrorMessage;
    await postTestEnvironment({ body: fakeTestEnvironment }).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('should throw an error if you try to create a test environment while missing required properties', async () => {
    const fakePool = makeFakePool({ poolName: 'myPool' });
    await dbOperator.insert(fakePool, 'pools');
    const fakeTestEnvironment = makeFakeTestEnvironment({ name: undefined });

    const expectedErrorMessage = 'When making a test environment, not every required parameter was provided.';
    let actualErrorMessage;
    await postTestEnvironment({ body: fakeTestEnvironment }).catch((error) => {
      actualErrorMessage = error.message;
    }).then(() => {
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });

  it('should throw an error if you try to create a test environment with an invalid status', async () => {
    const fakePool = makeFakePool({ poolName: 'myPool' });
    await dbOperator.insert(fakePool, 'pools');
    const fakeTestEnvironment = makeFakeTestEnvironment({ status: ['INVALID_STATUS'] });

    const expectedErrorMessage = 'Invalid status \'INVALID_STATUS\' provided when making test environment';
    let actualErrorMessage;
    await postTestEnvironment({ body: fakeTestEnvironment }).catch((error) => {
      actualErrorMessage = error.message;
    }).then(() => {
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });

  it('should ensure the event emitter is called correctly by the post test environment function', async () => {
    let wasEmitterCalled = false;

    const fakePool = makeFakePool({ poolName: 'myPool' });
    await dbOperator.insert(fakePool, 'pools');
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPool'] });

    const postTestEnvironmentMock = makePostTestEnvironment(
      createNewTestEnvironment,
      addTestEnvironmentIdToPool,
      dbOperator,
      {
        emitter: {
          emit: () => {
            wasEmitterCalled = true;
          },
        },
      },
      logger,
    );
    await postTestEnvironmentMock({ body: fakeTestEnvironment });
    expect(wasEmitterCalled).toBeTruthy();
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
});
