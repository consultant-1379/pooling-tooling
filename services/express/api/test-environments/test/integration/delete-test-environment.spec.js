const expect = require('expect');

const { deleteTestEnvironment } = require('../../controllers');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { makeDeleteTestEnvironment } = require('../../controllers/remove-test-environment');
const { removeTestEnvironmentIdFromPool, updatePoolViewIndices, updateEnvironmentsViewIndices } = require('../../use-cases');
const { dbOperator } = require('../../../../data-access');

const logger = require('../../../../logger/logger');

describe('Integration Test: (Test Environment service) Delete test environment', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });

  it('should successfully delete the correct test environment from the database', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({ pools: ['myPool'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 0, myPool: 0 } } });
    const fakeTestEnvironmentTwo = makeFakeTestEnvironment({ pools: ['myPool'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 1, myPool: 1 } } });
    const fakePool = makeFakePool(
      {
        poolName: 'myPool', assignedTestEnvironmentIds: [fakeTestEnvironmentOne.id, fakeTestEnvironmentTwo.id],
      },
    );
    await dbOperator.insert(fakePool, 'pools');
    const testEnvironmentFromDbFirstCheck = await dbOperator.findAll('testEnvironments');
    expect(testEnvironmentFromDbFirstCheck).toHaveLength(0);
    await dbOperator.insert(fakeTestEnvironmentOne, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironmentTwo, 'testEnvironments');
    const testEnvironmentFromDbSecondCheck = await dbOperator.findAll('testEnvironments');
    expect(testEnvironmentFromDbSecondCheck).toHaveLength(2);
    await deleteTestEnvironment({ params: { id: fakeTestEnvironmentOne.id } }, 'testEnvironments');
    const testEnvironmentFromDbThirdCheck = await dbOperator.findAll('testEnvironments');
    expect(testEnvironmentFromDbThirdCheck).toHaveLength(1);
    // Accounting for the fact that view indices are updated in the request
    fakeTestEnvironmentTwo.priorityInfo.viewIndices.testEnvironmentViewIndex = 0;
    fakeTestEnvironmentTwo.priorityInfo.viewIndices.myPool = 0;
    expect(testEnvironmentFromDbThirdCheck[0]).toEqual(fakeTestEnvironmentTwo);
  });

  it('should remove the test environments name from the assignedTestEnvironmentIds list when the environment is deleted', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPool'] });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    const fakePool = makeFakePool({ poolName: 'myPool', assignedTestEnvironmentIds: [fakeTestEnvironment.id] });
    await dbOperator.insert(fakePool, 'pools');
    const [poolsFromDbFirstCheck] = await dbOperator.findAll('pools');
    expect(poolsFromDbFirstCheck.assignedTestEnvironmentIds).toHaveLength(1);
    await deleteTestEnvironment({ params: { id: fakeTestEnvironment.id } }, 'testEnvironments');
    const [poolsFromDbSecondCheck] = await dbOperator.findAll('pools');
    expect(poolsFromDbSecondCheck.assignedTestEnvironmentIds).toHaveLength(0);
  });

  it('should update the test environments view indices when environment is deleted', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPool'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 0, myPool: 0 } } });
    const anotherFakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPool'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 1, myPool: 1 } } });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(anotherFakeTestEnvironment, 'testEnvironments');
    const fakePool = makeFakePool({ poolName: 'myPool', assignedTestEnvironmentIds: [fakeTestEnvironment.id, anotherFakeTestEnvironment.id] });
    await dbOperator.insert(fakePool, 'pools');
    const anotherFakeTestEnvironmentEnvironmentsViewIndex = anotherFakeTestEnvironment.priorityInfo.viewIndices.testEnvironmentViewIndex;
    const anotherFakeTestEnvironmentMyPoolViewIndex = anotherFakeTestEnvironment.priorityInfo.viewIndices.myPool;
    await deleteTestEnvironment({ params: { id: fakeTestEnvironment.id } }, 'testEnvironments');
    const updatedEnvironments = await dbOperator.findAll('testEnvironments');
    expect(updatedEnvironments[0].priorityInfo.viewIndices.testEnvironmentViewIndex).toEqual(anotherFakeTestEnvironmentEnvironmentsViewIndex - 1);
    expect(updatedEnvironments[0].priorityInfo.viewIndices.myPool).toEqual(anotherFakeTestEnvironmentMyPoolViewIndex - 1);
  });

  it('should ensure the event emitter is called correctly by the delete test environment function', async () => {
    let wasEmitterCalled = false;
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['myPool'], priorityInfo: { viewIndices: { testEnvironmentViewIndex: 0, myPool: 0 } } });
    const fakePool = makeFakePool(
      {
        poolName: 'myPool', assignedTestEnvironmentIds: [fakeTestEnvironment.id],
      },
    );

    await dbOperator.insert(fakePool, 'pools');
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const deleteTestEnvironmentMock = makeDeleteTestEnvironment(
      removeTestEnvironmentIdFromPool,
      updatePoolViewIndices,
      updateEnvironmentsViewIndices,
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
    const request = {
      params: {
        id: fakeTestEnvironment.id,
      },
    };
    await deleteTestEnvironmentMock(request);
    expect(wasEmitterCalled).toBeTruthy();
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
});
