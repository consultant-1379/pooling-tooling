const expect = require('expect');

const { patchTestEnvironment } = require('../../controllers');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { makePatchTestEnvironment } = require('../../controllers/patch-test-environment');
const {
  updateTestEnvironment,
  addTestEnvironmentIdToPool,
  removeTestEnvironmentIdFromPool,
  listTestEnvironmentById,
  addOrRemoveTestEnvironmentFromPool,
} = require('../../use-cases');
const { updatePool } = require('../../../pools/use-cases');
const { dbOperator } = require('../../../../data-access');

const { logger } = require('../../../../__test__/fixtures/logger.spec.js');

describe('Integration Test: (Test Environment service) Patch test environment', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });

  it('should successfully patch a test environment in the database', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testEnvironmentUpdates = {
      body: {
        name: 'UPDATED_TEST_ENVIRONMENT_NAME',
      },
      params: {
        id: fakeTestEnvironment.id,
      },
    };

    const testEnvironmentChanges = await patchTestEnvironment(testEnvironmentUpdates);
    expect(testEnvironmentChanges.properties).toEqual(fakeTestEnvironment.properties);
    expect(testEnvironmentChanges.name).toEqual(testEnvironmentUpdates.body.name);
    const allTestEnvironmentsFromDb = await dbOperator.findAll('testEnvironments');
    expect(allTestEnvironmentsFromDb).toHaveLength(1);
    const [testEnvironmentFromDb] = allTestEnvironmentsFromDb;
    expect(testEnvironmentFromDb.properties).toEqual(fakeTestEnvironment.properties);
    expect(testEnvironmentFromDb.name).toEqual(testEnvironmentUpdates.body.name);
  });

  it('should allow the test environment entity to be updated if there is no other test environment with the same name in database.', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({ name: 'TEST_ENVIRONMENT_ONE' });
    await dbOperator.insert(fakeTestEnvironmentOne, 'testEnvironments');

    const testEnvironmentUpdates = {
      body: {
        name: 'TEST_ENVIRONMENT_NEW',
      },
      params: {
        id: fakeTestEnvironmentOne.id,
      },
    };

    const testEnvironmentChanges = await patchTestEnvironment(testEnvironmentUpdates);

    expect(testEnvironmentChanges.name).toEqual('TEST_ENVIRONMENT_NEW');
  });

  it('should not allow the test environment entity to be updated if there is a test environment with the same name in database.', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({ name: 'TEST_ENVIRONMENT_ONE' });
    const fakeTestEnvironmentTwo = makeFakeTestEnvironment({ name: 'TEST_ENVIRONMENT_TWO' });
    await dbOperator.insert(fakeTestEnvironmentOne, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironmentTwo, 'testEnvironments');

    const testEnvironmentUpdates = {
      body: {
        name: 'TEST_ENVIRONMENT_TWO',
      },
      params: {
        id: fakeTestEnvironmentOne.id,
      },
    };

    const expectedErrorMessage = `A test environment named ${testEnvironmentUpdates.body.name} already exists. `
    + 'Can not update test environment with the same name.';
    let actualErrorMessage;
    await patchTestEnvironment(testEnvironmentUpdates).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('should thow an error if the test environment to be updated is not found.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testEnvironmentUpdates = {
      body: fakeTestEnvironment,
      params: {
        id: 'fakeIdNotPresentInDb',
      },
    };

    const expectedErrorMessage = 'Test Environment not found';
    let actualErrorMessage;
    await patchTestEnvironment(testEnvironmentUpdates).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('should ensure pool is successfully updated when a test environment is added to a pool via a patch', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPoolOne'] });
    const fakePoolOne = makeFakePool({ poolName: 'myPoolOne', assignedTestEnvironmentIds: [fakeTestEnvironment.id] });
    const fakePoolTwo = makeFakePool({ poolName: 'myPoolTwo' });
    await dbOperator.insert(fakePoolOne, 'pools');
    await dbOperator.insert(fakePoolTwo, 'pools');
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testEnvironmentUpdates = {
      body: {
        pools: ['myPoolOne', 'myPoolTwo'],
      },
      params: {
        id: fakeTestEnvironment.id,
      },
    };

    await patchTestEnvironment(testEnvironmentUpdates);
    const [testEnvironmentFromDb] = await dbOperator.findAll('testEnvironments');
    const poolsFromDb = await dbOperator.findAll('pools');
    expect(testEnvironmentFromDb.pools).toContain('myPoolOne');
    expect(testEnvironmentFromDb.pools).toContain('myPoolTwo');

    for (const pool of poolsFromDb) {
      expect(pool.assignedTestEnvironmentIds).toContain(fakeTestEnvironment.id);
    }
  });

  it('should ensure pool is successfully updated when a test environment is removed from a pool via a patch', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPoolOne', 'myPoolTwo'] });
    const fakePoolOne = makeFakePool({ poolName: 'myPoolOne', assignedTestEnvironmentIds: [fakeTestEnvironment.id] });
    const fakePoolTwo = makeFakePool({ poolName: 'myPoolTwo', assignedTestEnvironmentIds: [fakeTestEnvironment.id] });
    await dbOperator.insert(fakePoolOne, 'pools');
    await dbOperator.insert(fakePoolTwo, 'pools');
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testEnvironmentUpdates = {
      body: {
        pools: ['myPoolOne'],
      },
      params: {
        id: fakeTestEnvironment.id,
      },
    };

    await patchTestEnvironment(testEnvironmentUpdates);
    const [testEnvironmentFromDb] = await dbOperator.findAll('testEnvironments');
    const poolsFromDb = await dbOperator.findAll('pools');
    expect(testEnvironmentFromDb.pools).toContain('myPoolOne');
    expect(testEnvironmentFromDb.pools).not.toContain('myPoolTwo');
    expect(poolsFromDb[0].assignedTestEnvironmentIds).toContain(fakeTestEnvironment.id);
    expect(poolsFromDb[1].assignedTestEnvironmentIds).not.toContain(fakeTestEnvironment.id);
    expect(poolsFromDb[1].assignedTestEnvironmentIds).toHaveLength(0);
  });

  it('should ensure the pools is successfully updated when the pool is changed via a patch', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPoolOne'] });
    const fakePoolOne = makeFakePool({ poolName: 'myPoolOne', assignedTestEnvironmentIds: [fakeTestEnvironment.id] });
    const fakePoolTwo = makeFakePool({ poolName: 'myPoolTwo' });
    await dbOperator.insert(fakePoolOne, 'pools');
    await dbOperator.insert(fakePoolTwo, 'pools');
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testEnvironmentUpdates = {
      body: {
        pools: ['myPoolTwo'],
      },
      params: {
        id: fakeTestEnvironment.id,
      },
    };

    await patchTestEnvironment(testEnvironmentUpdates);
    const [testEnvironmentFromDb] = await dbOperator.findAll('testEnvironments');
    const poolsFromDb = await dbOperator.findAll('pools');
    expect(testEnvironmentFromDb.pools).toHaveLength(1);
    expect(testEnvironmentFromDb.pools).toContain('myPoolTwo');
    expect(poolsFromDb[0].assignedTestEnvironmentIds).not.toContain(fakeTestEnvironment.id);
    expect(poolsFromDb[1].assignedTestEnvironmentIds).toContain(fakeTestEnvironment.id);
  });

  // Double check at higher level
  it('should throw an error if pools are removed while patching an environment', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPoolOne'] });
    const fakePoolOne = makeFakePool({ poolName: 'myPoolOne', assignedTestEnvironmentIds: [fakeTestEnvironment.id] });
    await dbOperator.insert(fakePoolOne, 'pools');
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testEnvironmentUpdates = {
      body: {
        pools: [],
      },
      params: {
        id: fakeTestEnvironment.id,
      },
    };

    const expectedErrorMessage = 'No pools were provided when making test environment';
    let actualErrorMessage;
    await patchTestEnvironment(testEnvironmentUpdates).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
    const [testEnvironmentFromDb] = await dbOperator.findAll('testEnvironments');
    expect(testEnvironmentFromDb.assignedTestEnvironmentIds).toEqual(fakeTestEnvironment.assignedTestEnvironmentIds);
  });

  it('should ensure the event emitter is called correctly by the patch test environment function', async () => {
    let wasEmitterCalled = false;

    const fakeTestEnvironment = makeFakeTestEnvironment();
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testEnvironmentUpdates = {
      body: {
        name: 'UPDATED_TEST_ENVIRONMENT_NAME',
      },
      params: {
        id: fakeTestEnvironment.id,
      },
    };

    const patchPoolMock = makePatchTestEnvironment(
      listTestEnvironmentById,
      updateTestEnvironment,
      addOrRemoveTestEnvironmentFromPool,
      addTestEnvironmentIdToPool,
      removeTestEnvironmentIdFromPool,
      updatePool,
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

    await patchPoolMock(testEnvironmentUpdates);
    expect(wasEmitterCalled).toBeTruthy();
  });
  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
});
