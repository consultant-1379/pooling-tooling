const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { deletePool } = require('../../controllers');
const { makeDeletePool } = require('../../controllers/delete-pool');
const { ensureNoTestEnvironmentsAttachedToPool } = require('../../use-cases');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

const logger = require('../../../../logger/logger');

describe('Integration Test: (Pool service) Remove pool controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('pools');
  });

  it('successfully removes a pool', async () => {
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: [] });
    await dbOperator.insert(fakePool, 'pools');

    const fakeHttpRequest = {
      params: {
        id: fakePool.id,
      },
    };

    await deletePool(fakeHttpRequest);

    const poolFromDbAfterDeleting = await dbOperator.findAll('pools');
    expect(poolFromDbAfterDeleting.length).toEqual(0);
  });

  it('should fail to remove a pool if it has assigned test environments attached to it', async () => {
    const fakePool = makeFakePool();
    await dbOperator.insert(fakePool, 'pools');

    const fakeHttpRequest = {
      params: {
        id: fakePool.id,
      },
    };

    const expectedErrorMessage = `There are currently test environments attached to pool ${
      fakePool.poolName}. Assign said test environments to another pool before deleting the current one.`;
    let actualErrorMessage;
    await deletePool(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });

    const poolFromDbAfterAttemptingDelete = await dbOperator.findAll('pools');
    expect(poolFromDbAfterAttemptingDelete.length).toEqual(1);
  });

  it('should ensure the appropriate error is thrown if there are test environments attached  to the pool', async () => {
    const fakePool = makeFakePool();
    await dbOperator.insert(fakePool, 'pools');

    const fakeHttpRequest = {
      params: {
        id: fakePool.id,
      },
    };

    const deletePoolMock = makeDeletePool(
      ensureNoTestEnvironmentsAttachedToPool,
      {
        remove: () => {},
        findById: () => [undefined],
      },
      {
        emitter: {
          emit: () => {},
        },
      },
      logger,
    );
    const expectedErrorMessage = 'No pool provided when checking if there are test environments attached to pool';
    let actualErrorMessage;

    await deletePoolMock(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    }).then(() => {
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });

  it('should ensure the event emitter is called correctly by the delete pool function', async () => {
    let wasEmitterCalled = false;
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: [] });
    await dbOperator.insert(fakePool, 'pools');

    const deletePoolMock = makeDeletePool(
      ensureNoTestEnvironmentsAttachedToPool,
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
        id: fakePool.id,
      },
    };
    await deletePoolMock(request);
    expect(wasEmitterCalled).toBeTruthy();
  });

  after(async () => {
    await dbOperator.dropCollection('pools');
  });
});
