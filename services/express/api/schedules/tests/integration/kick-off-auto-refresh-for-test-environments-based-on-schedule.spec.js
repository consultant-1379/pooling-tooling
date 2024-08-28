const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule } = require('../../controllers');

describe('Integration Test: (Schedule service) Kick off auto refresh for test environments based on schedule controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('schedules');
    await dbOperator.dropCollection('testEnvironments');
  });

  it('successfully kicks off auto refresh flow against test environment', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment();
    const fakeTestEnvironmentTwo = makeFakeTestEnvironment();
    await dbOperator.insert(fakeTestEnvironmentOne, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironmentTwo, 'testEnvironments');

    const fakeSchedule = makeFakeSchedule({
      scheduleEnabled: true,
      typeOfItemsToSchedule: 'test-environment',
      refreshData: {
        itemsToScheduleIds: [fakeTestEnvironmentOne.id, fakeTestEnvironmentTwo.id],
        refreshedSpinnakerPipelineApplicationName: 'thunderbeetest',
        refreshedSpinnakerPipelineName: 'Fake_Test_Refresh_Flow_Fake',
      },
      retentionPolicyData: {
        retentionPolicyEnabled: false,
        numOfStanbyEnvsToBeRetained: 1,
        numOfEiapReleaseForComparison: 1,
      },
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'pso',
      },
    });

    await dbOperator.insert(fakeSchedule, 'schedules');
    const autoRefreshKickedOff = await kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule(fakeSchedule);

    expect(autoRefreshKickedOff).toBeTruthy();
  });

  after(async () => {
    await dbOperator.dropCollection('schedules');
    await dbOperator.dropCollection('testEnvironments');
  });
});
