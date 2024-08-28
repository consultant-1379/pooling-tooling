const expect = require('expect');

const { makePatchTestEnvironmentFromReservedToQuarantined } = require('../../controllers/patch-test-environment-from-reserved-to-quarantined');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Pipeline Functions service) Testing patch controller to update the Test Environment (Reserved -> Quarantined) and/or Request', () => {
  const emitter = { emit: () => { } };
  it('successfully patches a test environment to quarantined', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Reserved',
      stage: 'http://spinnaker.url',
    });
    const fakeQuarantinedTestEnvironment = makeFakeTestEnvironment(fakeTestEnvironment, {
      status: 'Quarantine',
      stage: 'http://spinnaker.url',
    });

    const fakeHttpRequest = {
      body: {
        additionalInfo: 'TestEnvironment',
      },
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    const patchTestEnvironmentFromReservedToQuarantined = makePatchTestEnvironmentFromReservedToQuarantined(
      { updateTestEnvironment: () => fakeQuarantinedTestEnvironment, listTestEnvironmentById: () => [fakeTestEnvironment] },
      { findOneAndUpdate: () => fakeQuarantinedTestEnvironment, findBySearchQuery: () => [fakeTestEnvironment] },
      () => emitter,
      { info: () => 'Test log', logFormatter: () => {} },
    );

    const testEnvironmentChanges = await patchTestEnvironmentFromReservedToQuarantined(fakeHttpRequest);
    expect(testEnvironmentChanges).toEqual(fakeQuarantinedTestEnvironment);
  });

  it('unsuccessfully patches test environment from reserved to quarantined', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const expectedErrorMessage = 'Faking something going wrong!';

    const fakeHttpRequest = {
      body: {
        additionalInfo: 'TestEnvironment',
      },
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    const patchTestEnvironmentFromReservedToQuarantined = makePatchTestEnvironmentFromReservedToQuarantined(
      {
        updateTestEnvironment: () => { throw Error(expectedErrorMessage); },
        listTestEnvironmentById: () => [fakeTestEnvironment],
      },
      {
        update: () => fakeTestEnvironment,
        findBySearchQuery: () => [fakeTestEnvironment],
      },
      () => emitter,
      {
        info: () => 'Test log', logFormatter: () => {},
      },
    );

    let actualErrorMessage;
    await patchTestEnvironmentFromReservedToQuarantined(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('throws an error when retrieved test environment is an empty object', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();

    const fakeHttpRequest = {
      body: {
        additionalInfo: 'TestEnvironment',
      },
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    const expectedErrorMessage = 'Retrieved test environment is undefined or the object is empty';

    const patchTestEnvironmentFromReservedToQuarantined = makePatchTestEnvironmentFromReservedToQuarantined(
      {
        updateTestEnvironment: () => {},
        listTestEnvironmentById: () => [fakeTestEnvironment],
      },
      {
        update: () => fakeTestEnvironment,
        findBySearchQuery: () => [{}],
      },
      () => emitter,
      {
        info: () => 'Test log', logFormatter: () => {}, error: () => 'Test error log',
      },
    );

    let actualErrorMessage;
    await patchTestEnvironmentFromReservedToQuarantined(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
