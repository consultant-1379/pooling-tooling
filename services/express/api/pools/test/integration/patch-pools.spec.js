const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { patchPool } = require('../../controllers');
const { makePatchPool } = require('../../controllers/patch-pool');
const { updatePool } = require('../../use-cases');

const { logger } = require('../../../../__test__/fixtures/logger.spec.js');

describe('Integration Test: (Pool service) Patch pool controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('pools');
  });

  it('successfully updates a pool', async () => {
    const fakePool = makeFakePool();
    await dbOperator.insert(fakePool, 'pools');

    const fakeHttpRequest = {
      body: {
        additionalInfo: 'Test Information',
      },
      params: {
        id: fakePool.id,
      },
    };

    const patchedPool = await patchPool(fakeHttpRequest);
    expect(patchedPool.additionalInfo).toEqual('Test Information');
  });

  it('should throw an error if no pool is found', async () => {
    const fakeHttpRequest = {
      body: {
        additionalInfo: 'Test Information',
      },
      params: {
        id: 'idDoesNotExists',
      },
    };

    const expectedErrorMessage = 'Pool not found';
    let actualErrorMessage;
    await patchPool(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('should ensure the event emitter is called correctly by the patch pool function', async () => {
    let wasEmitterCalled = false;

    const fakePool = makeFakePool();
    await dbOperator.insert(fakePool, 'pools');
    const patchPoolMock = makePatchPool(
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

    const fakeHttpRequest = {
      body: {
        additionalInfo: 'Test Information',
      },
      params: {
        id: fakePool.id,
      },
    };
    await patchPoolMock(fakeHttpRequest);
    expect(wasEmitterCalled).toBeTruthy();
  });

  after(async () => {
    await dbOperator.dropCollection('pools');
  });
});
