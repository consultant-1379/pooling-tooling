const expect = require('expect');

const { determineTestEnvironmentsToBeRefreshed } = require('../../use-cases');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Schedules service) Determine test environments to be refreshed', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });

  it('successfully determines the test environments to be refreshed', async () => {
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ status: 'Standby', properties: { version: '2.0.0-1350' } });
    const fakeTestEnvironment2 = makeFakeTestEnvironment({ status: 'Standby', properties: { version: '2.0.0-1349' } });
    const fakeTestEnvironment3 = makeFakeTestEnvironment({ status: 'Quarantine', properties: { version: '0.1.0-36' } });
    const fakeTestEnvironment4 = makeFakeTestEnvironment({ status: 'Standby', properties: { version: '1.0.0-1321' } });
    const fakeTestEnvironment5 = makeFakeTestEnvironment({ status: 'Standby', properties: { version: '2.0.0-1352' } });
    const fakeTestEnvironment6 = makeFakeTestEnvironment({ status: 'Standby', properties: { version: '0.0.0-97' } });
    const fakeTestEnvironment7 = makeFakeTestEnvironment({ status: 'Quarantine', properties: { version: '1.1.0-549' } });
    const fakeTestEnvironment8 = makeFakeTestEnvironment({ status: 'Standby', properties: { version: '2.0.0-1348' } });
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment2, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment3, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment4, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment5, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment6, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment7, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment8, 'testEnvironments');

    const assignedTestEnvironmentIds = [fakeTestEnvironment1.id, fakeTestEnvironment2.id, fakeTestEnvironment3.id,
      fakeTestEnvironment4.id, fakeTestEnvironment5.id, fakeTestEnvironment6.id, fakeTestEnvironment7.id,
      fakeTestEnvironment8.id];

    const testEnvironmentsToBeRefreshed = await determineTestEnvironmentsToBeRefreshed(assignedTestEnvironmentIds, 2, 5);
    expect(testEnvironmentsToBeRefreshed).toEqual([fakeTestEnvironment2.id, fakeTestEnvironment8.id, fakeTestEnvironment4.id,
      fakeTestEnvironment6.id]);
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
});
