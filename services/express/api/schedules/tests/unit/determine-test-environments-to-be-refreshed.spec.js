const expect = require('expect');
const cuid = require('cuid');
const sinon = require('sinon');

const { makeDetermineTestEnvironmentsToBeRefreshed } = require('../../use-cases/determine-test-environments-to-be-refreshed');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Schedule service) Determine test environments to be refreshed', () => {
  it('successfully determines the test environments to be refreshed', async () => {
    const envId1 = cuid();
    const envId2 = cuid();
    const envId3 = cuid();
    const envId4 = cuid();
    const envId5 = cuid();
    const envId6 = cuid();
    const envId7 = cuid();
    const envId8 = cuid();

    const fakeTestEnvironment1 = makeFakeTestEnvironment({
      id: envId1,
      status: 'Standby',
      properties: {
        version: '2.0.0-1353',
      },
    });
    const fakeTestEnvironment2 = makeFakeTestEnvironment({
      id: envId2,
      status: 'Standby',
      properties: {
        version: '2.0.0-1351',
      },
    });
    const fakeTestEnvironment3 = makeFakeTestEnvironment({
      id: envId3,
      status: 'Quarantine',
      properties: {
        version: '0.1.0-36',
      },
    });
    const fakeTestEnvironment4 = makeFakeTestEnvironment({
      id: envId4,
      status: 'Standby',
      properties: {
        version: '1.0.0-1321',
      },
    });
    const fakeTestEnvironment5 = makeFakeTestEnvironment({
      id: envId5,
      status: 'Standby',
      properties: {
        version: '2.0.0-1352',
      },
    });
    const fakeTestEnvironment6 = makeFakeTestEnvironment({
      id: envId6,
      status: 'Standby',
      properties: {
        version: '0.0.0-97',
      },
    });
    const fakeTestEnvironment7 = makeFakeTestEnvironment({
      id: envId7,
      status: 'Quarantine',
      properties: {
        version: '1.1.0-549',
      },
    });
    const fakeTestEnvironment8 = makeFakeTestEnvironment({
      id: envId8,
      status: 'Standby',
      properties: {
        version: '2.0.0-1348',
      },
    });

    const getTestEnvironmentByIdStub = sinon.stub();

    getTestEnvironmentByIdStub.onCall(0).resolves([fakeTestEnvironment1]);
    getTestEnvironmentByIdStub.onCall(1).resolves([fakeTestEnvironment2]);
    getTestEnvironmentByIdStub.onCall(2).resolves([fakeTestEnvironment3]);
    getTestEnvironmentByIdStub.onCall(3).resolves([fakeTestEnvironment4]);
    getTestEnvironmentByIdStub.onCall(4).resolves([fakeTestEnvironment5]);
    getTestEnvironmentByIdStub.onCall(5).resolves([fakeTestEnvironment6]);
    getTestEnvironmentByIdStub.onCall(6).resolves([fakeTestEnvironment7]);
    getTestEnvironmentByIdStub.onCall(7).resolves([fakeTestEnvironment8]);

    const determineTestEnvironmentsToBeRefreshed = makeDetermineTestEnvironmentsToBeRefreshed(
      () => getTestEnvironmentByIdStub(),
      (version) => version,
      () => undefined,
      () => [fakeTestEnvironment1, fakeTestEnvironment5, fakeTestEnvironment2, fakeTestEnvironment8, fakeTestEnvironment4, fakeTestEnvironment6],
      () => ['2.0.0-1354', '2.0.0-1353', '2.0.0-1352', '2.0.0-1351', '2.0.0-1350', '2.0.0-1349'],
      { info: () => 'Test log', error: () => 'Test error log' },
    );

    const assignedTestEnvironmentIds = [fakeTestEnvironment1.id, fakeTestEnvironment2.id, fakeTestEnvironment3.id, fakeTestEnvironment4.id,
      fakeTestEnvironment5.id, fakeTestEnvironment6.id, fakeTestEnvironment7.id, fakeTestEnvironment8.id];

    const testEnvironmentsToBeRefreshed = await determineTestEnvironmentsToBeRefreshed(assignedTestEnvironmentIds, 2, 5);
    expect(testEnvironmentsToBeRefreshed).toEqual([fakeTestEnvironment8.id, fakeTestEnvironment4.id, fakeTestEnvironment6.id]);
  });

  it('throws an error if no test environments require refreshing', async () => {
    const envId1 = cuid();
    const envId2 = cuid();
    const envId3 = cuid();

    const fakeTestEnvironment1 = makeFakeTestEnvironment({
      id: envId1,
      status: 'Standby',
      properties: {
        version: '2.0.0-1353',
      },
    });
    const fakeTestEnvironment2 = makeFakeTestEnvironment({
      id: envId2,
      status: 'Standby',
      properties: {
        version: '2.0.0-1352',
      },
    });
    const fakeTestEnvironment3 = makeFakeTestEnvironment({
      id: envId3,
      status: 'Standby',
      properties: {
        version: '2.0.0-1351',
      },
    });

    const getTestEnvironmentByIdStub = sinon.stub();

    getTestEnvironmentByIdStub.onCall(0).resolves([fakeTestEnvironment1]);
    getTestEnvironmentByIdStub.onCall(1).resolves([fakeTestEnvironment2]);
    getTestEnvironmentByIdStub.onCall(2).resolves([fakeTestEnvironment3]);

    const determineTestEnvironmentsToBeRefreshed = makeDetermineTestEnvironmentsToBeRefreshed(
      () => getTestEnvironmentByIdStub(),
      (version) => version,
      () => undefined,
      () => [fakeTestEnvironment1, fakeTestEnvironment2, fakeTestEnvironment3],
      () => ['2.0.0-1354', '2.0.0-1353', '2.0.0-1352', '2.0.0-1351', '2.0.0-1350', '2.0.0-1349'],
      { info: () => 'Test log', error: () => 'Test error log' },
    );

    const assignedTestEnvironmentIds = [fakeTestEnvironment1.id, fakeTestEnvironment2.id, fakeTestEnvironment3.id];

    const expectedErrorMessage = 'No test environments passed, unable to determine test environments to refresh';

    try {
      await determineTestEnvironmentsToBeRefreshed(assignedTestEnvironmentIds, 1, 4);
    } catch (error) {
      expect(error.message).toBe(expectedErrorMessage);
    }
  });

  it('handles an empty array', async () => {
    const getTestEnvironmentByIdStub = sinon.stub();
    const determineTestEnvironmentsToBeRefreshed = makeDetermineTestEnvironmentsToBeRefreshed(
      () => getTestEnvironmentByIdStub(),
      (version) => version,
      () => undefined,
      () => [],
      () => [],
      { info: () => 'Test log', error: () => 'Test error log' },
    );
    const assignedTestEnvironmentIds = [];
    const expectedErrorMessage = 'No test environments passed, unable to determine test environments to refresh';

    try {
      await determineTestEnvironmentsToBeRefreshed(assignedTestEnvironmentIds, 1, 4);
    } catch (error) {
      expect(error.message).toBe(expectedErrorMessage);
    }
  });

  it('handles when no test environments are passed in', async () => {
    const getTestEnvironmentByIdStub = sinon.stub();
    const determineTestEnvironmentsToBeRefreshed = makeDetermineTestEnvironmentsToBeRefreshed(
      () => getTestEnvironmentByIdStub(),
      (version) => version,
      () => undefined,
      () => [],
      () => [],
      { info: () => 'Test log', error: () => 'Test error log' },
    );
    const expectedErrorMessage = 'No test environments passed, unable to determine test environments to refresh';

    try {
      await determineTestEnvironmentsToBeRefreshed();
    } catch (error) {
      expect(error.message).toBe(expectedErrorMessage);
    }
  });

  it('handles when invalid semver passed in', async () => {
    const envId1 = cuid();
    const envId2 = cuid();
    const envId3 = cuid();
    const envId4 = cuid();
    const envId5 = cuid();
    const envId6 = cuid();
    const envId7 = cuid();
    const envId8 = cuid();

    const fakeTestEnvironment1 = makeFakeTestEnvironment({
      id: envId1,
      status: 'Standby',
      properties: {
        version: 'invalid',
      },
    });
    const fakeTestEnvironment2 = makeFakeTestEnvironment({
      id: envId2,
      status: 'Standby',
      properties: {
        version: 'not-a-semver',
      },
    });
    const fakeTestEnvironment3 = makeFakeTestEnvironment({
      id: envId3,
      status: 'Quarantine',
      properties: {
        version: 'invalid',
      },
    });
    const fakeTestEnvironment4 = makeFakeTestEnvironment({
      id: envId4,
      status: 'Standby',
      properties: {
        version: 'not-a-semver',
      },
    });
    const fakeTestEnvironment5 = makeFakeTestEnvironment({
      id: envId5,
      status: 'Standby',
      properties: {
        version: 'invalid',
      },
    });
    const fakeTestEnvironment6 = makeFakeTestEnvironment({
      id: envId6,
      status: 'Standby',
      properties: {
        version: 'not-a-semver',
      },
    });
    const fakeTestEnvironment7 = makeFakeTestEnvironment({
      id: envId7,
      status: 'Quarantine',
      properties: {
        version: 'invalid',
      },
    });
    const fakeTestEnvironment8 = makeFakeTestEnvironment({
      id: envId8,
      status: 'Standby',
      properties: {
        version: 'not-a-semver',
      },
    });

    const getTestEnvironmentByIdStub = sinon.stub();

    getTestEnvironmentByIdStub.onCall(0).resolves([fakeTestEnvironment1]);
    getTestEnvironmentByIdStub.onCall(1).resolves([fakeTestEnvironment2]);
    getTestEnvironmentByIdStub.onCall(2).resolves([fakeTestEnvironment3]);
    getTestEnvironmentByIdStub.onCall(3).resolves([fakeTestEnvironment4]);
    getTestEnvironmentByIdStub.onCall(4).resolves([fakeTestEnvironment5]);
    getTestEnvironmentByIdStub.onCall(5).resolves([fakeTestEnvironment6]);
    getTestEnvironmentByIdStub.onCall(6).resolves([fakeTestEnvironment7]);
    getTestEnvironmentByIdStub.onCall(7).resolves([fakeTestEnvironment8]);

    const determineTestEnvironmentsToBeRefreshed = makeDetermineTestEnvironmentsToBeRefreshed(
      () => getTestEnvironmentByIdStub(),
      (version) => String(version).concat('no-match'),
      () => undefined,
      () => [],
      () => ['2.0.0-1354', '2.0.0-1353', '2.0.0-1352', '2.0.0-1351', '2.0.0-1350', '2.0.0-1349'],
      { info: () => 'Test log', error: () => 'Test error log' },
    );

    const assignedTestEnvironmentIds = [fakeTestEnvironment1.id, fakeTestEnvironment2.id, fakeTestEnvironment3.id, fakeTestEnvironment4.id,
      fakeTestEnvironment5.id, fakeTestEnvironment6.id, fakeTestEnvironment7.id, fakeTestEnvironment8.id];

    try {
      await determineTestEnvironmentsToBeRefreshed(assignedTestEnvironmentIds, 2, 5);
    } catch (err) {
      expect(err.message).toStrictEqual('No test environments were found that require refreshing');
    }
  });
});
