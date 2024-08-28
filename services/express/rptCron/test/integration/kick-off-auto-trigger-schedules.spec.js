const expect = require('expect');

const { dbOperator } = require('../../../data-access');

const { makeFakeSchedule } = require('../../../__test__/fixtures/schedule.spec.js');
const { makeFakePool } = require('../../../__test__/fixtures/pool.spec.js');
const { makeFakeTestEnvironment } = require('../../../__test__/fixtures/test-environment.spec.js');
const { kickOffAutoTriggerSchedules } = require('../../controllers');

describe('Integration Test: (Cron service) Kick off auto trigger schedules controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('schedules');
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
  it('should successfully kick off the entire auto trigger flow against pools and environments', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({ status: 'Available' });
    const fakeTestEnvironmentTwo = makeFakeTestEnvironment({ status: 'Available' });
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: [fakeTestEnvironmentOne.id] });
    const fakeScheduleOne = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      refreshData: {
        itemsToScheduleIds: [fakePool.id],
      },
      scheduleOptions: {
        scheduleType: 'auto-trigger',
        cronSchedule: '*/15 * * * *',
        projectArea: 'aas',
      },
    });
    const fakeScheduleTwo = makeFakeSchedule({
      typeOfItemsToSchedule: 'test-environment',
      refreshData: {
        itemsToScheduleIds: [fakeTestEnvironmentTwo.id],
      },
      scheduleOptions: {
        scheduleType: 'auto-trigger',
        cronSchedule: '*/15 * * * *',
        projectArea: 'aas',
      },
    });

    await dbOperator.insert(fakeTestEnvironmentOne, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironmentTwo, 'testEnvironments');
    await dbOperator.insert(fakePool, 'pools');
    await dbOperator.insert(fakeScheduleOne, 'schedules');
    await dbOperator.insert(fakeScheduleTwo, 'schedules');

    const wasAutoTriggerPipelineKickedOff = await kickOffAutoTriggerSchedules();

    expect(wasAutoTriggerPipelineKickedOff).toBeTruthy();
  });

  after(async () => {
    await dbOperator.dropCollection('schedules');
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
});
