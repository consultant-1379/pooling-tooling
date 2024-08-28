const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { postPool } = require('../../controllers');
const { makePostPool } = require('../../controllers/post-pool');
const { createNewPool } = require('../../use-cases');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

const logger = require('../../../../logger/logger');

describe('Integration Test: (Pool service) Post pool controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('pools');
  });

  it('successfully posts a pool', async () => {
    const fakePool = makeFakePool();
    const fakeHttpRequest = {
      body: fakePool,
    };

    const postedPool = await postPool(fakeHttpRequest);
    expect(postedPool.poolName).toEqual(fakePool.poolName);
    expect(postedPool.additionalInfo).toEqual(fakePool.additionalInfo);
    expect(postedPool.assignedTestEnvironmentIds).toEqual(fakePool.assignedTestEnvironmentIds);
    expect(postedPool.creatorDetails).toEqual(fakePool.creatorDetails);
    expect(postedPool.id).toEqual(fakePool.id);
  });

  it('should throw an error if a pool with the provided name already exists', async () => {
    const fakePool = makeFakePool({ poolName: 'TEST' });
    await dbOperator.insert(fakePool, 'pools');

    const fakeHttpRequest = {
      body: fakePool,
    };

    const expectedErrorMessage = `A pool named ${fakePool.poolName} already exists. Not creating new pool with the same name.`;
    let actualErrorMessage;
    await postPool(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('should ensure the event emitter is called correctly by the post pool function', async () => {
    let wasEmitterCalled = false;

    const fakePool = makeFakePool();
    const fakeHttpRequest = {
      body: fakePool,
    };

    const postPoolMock = makePostPool(
      createNewPool,
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
    await postPoolMock(fakeHttpRequest);
    expect(wasEmitterCalled).toBeTruthy();
  });

  it('should throw an error if an invalid id is passed into pool creation', async () => {
    const fakePool = makeFakePool({ id: 'INVALID_ID' });
    const fakeHttpRequest = {
      body: fakePool,
    };

    let actualErrorMessage;
    const expectedErrorMessage = 'Pool entity must have a valid id.';

    await postPool(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    }).then(() => {
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });

  it('should throw an error if invalid pool information is provided on pool creation', async () => {
    const fakePool = makeFakePool({ poolName: undefined });
    const fakeHttpRequest = {
      body: fakePool,
    };

    let actualErrorMessage;
    const expectedErrorMessage = 'When making a pool, not every required property was provided.';

    await postPool(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    }).then(() => {
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });

  it('should throw an error if the assignedTestEnvironmentIds key is not an array', async () => {
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: 'NOT_AN_ARRAY' });
    const fakeHttpRequest = {
      body: fakePool,
    };

    let actualErrorMessage;
    const expectedErrorMessage = 'Pool entity must use array for assignedTestEnvironmentIds.';

    await postPool(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    }).then(() => {
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });

  it('should throw an error if the poolCreator object is not in the correct format', async () => {
    const fakePool = makeFakePool({ creatorDetails: 'INVALID_DETAILS' });
    const fakeHttpRequest = {
      body: fakePool,
    };

    let actualErrorMessage;
    const expectedErrorMessage = 'Invalid Creator Details provided when making pool';

    await postPool(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    }).then(() => {
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });

  after(async () => {
    await dbOperator.dropCollection('pools');
  });
});
