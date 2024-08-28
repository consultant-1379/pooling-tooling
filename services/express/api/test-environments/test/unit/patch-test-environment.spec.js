const expect = require('expect');

const {
  makePatchTestEnvironment,
} = require('../../controllers/patch-test-environment');
const {
  makeFakeTestEnvironment,
} = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Patch test environment controller', () => {
  const emitter = { emit: () => {} };
  it('successfully patches a test environment', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const fakeHttpRequest = {
      params: {
        id: fakeTestEnvironment.id,
      },
      body: fakeTestEnvironment,
    };
    const fakeUpdatedTestEnv = { $set: fakeTestEnvironment };
    const patchTestEnvironment = makePatchTestEnvironment(
      () => fakeTestEnvironment,
      () => fakeUpdatedTestEnv,
      () => undefined,
      () => undefined,
      () => undefined,
      () => undefined,
      {
        findOneAndUpdate: () => fakeTestEnvironment,
        findById: () => [fakeTestEnvironment],
        findBySearchQuery: () => {},
      },
      () => emitter,
      {
        info: () => 'Test log',
        logFormatter: () => {},
        error: () => 'Test log',
      },
    );
    const testEnvironmentChanges = await patchTestEnvironment(fakeHttpRequest);
    expect(testEnvironmentChanges).toEqual(fakeTestEnvironment);
  });

  it('unsuccessfully patches a test environment', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const fakeHttpRequest = {
      params: {
        id: fakeTestEnvironment.id,
      },
      body: fakeTestEnvironment,
    };
    const expectedErrorMessage = 'Faking something going wrong!';
    const patchTestEnvironment = makePatchTestEnvironment(
      () => fakeTestEnvironment,
      () => {
        throw Error(expectedErrorMessage);
      },
      () => undefined,
      () => undefined,
      () => undefined,
      () => undefined,
      {
        update: () => fakeTestEnvironment,
        findById: () => [fakeTestEnvironment],
        findBySearchQuery: () => {},
      },
      () => emitter,
      {
        info: () => 'Test log',
        logFormatter: () => {},
        error: () => 'Test log',
      },
    );

    let actualErrorMessage;
    await patchTestEnvironment(fakeHttpRequest)
      .catch((error) => {
        actualErrorMessage = error.message;
      })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('successfully patches a test environment if "name" is not provided in HttpRequest', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const testRequestId = { requestId: 'fakeRequestId' };
    const fakeHttpRequest = {
      params: {
        id: fakeTestEnvironment.id,
      },
      body: testRequestId,
    };

    const patchTestEnvironment = makePatchTestEnvironment(
      () => fakeTestEnvironment,
      () => fakeTestEnvironment,
      () => fakeHttpRequest,
      () => undefined,
      () => undefined,
      () => undefined,
      {
        findOneAndUpdate: () => testRequestId,
        findById: () => [fakeTestEnvironment],
        findBySearchQuery: () => {},
      },
      () => emitter,
      {
        info: () => 'Test log',
        logFormatter: () => {},
        error: () => 'Test log',
      },
    );

    const testEnvironmentChanges = await patchTestEnvironment(fakeHttpRequest);
    expect(testEnvironmentChanges.requestId).toEqual('fakeRequestId');
  });
});
