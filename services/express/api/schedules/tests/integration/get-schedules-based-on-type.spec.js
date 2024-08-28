const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');
const { getSchedulesBasedOnType } = require('../../controllers');

describe('Integration Test: (Schedule service) Get schedules based on type controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('schedules');
  });

  it('successfully gets schedules based on type of schedule', async () => {
    const fakeAutoRefreshSchedule = makeFakeSchedule({ scheduleOptions: { scheduleType: 'auto-refresh' } });
    const fakeAutoHealthcheckSchedule = makeFakeSchedule({ scheduleOptions: { scheduleType: 'auto-healthcheck' } });
    await dbOperator.insert(fakeAutoRefreshSchedule, 'schedules');
    await dbOperator.insert(fakeAutoHealthcheckSchedule, 'schedules');

    const autoRefreshSchedules = await getSchedulesBasedOnType({ params: { typeOfItemsToSchedule: 'auto-refresh' } });
    expect(autoRefreshSchedules).toHaveLength(1);
    expect(autoRefreshSchedules[0]).toEqual(fakeAutoRefreshSchedule);
  });

  it('should throw an error if there is no type of schedule corresponding to that which was passed in', async () => {
    const fakeAutoRefreshSchedule = makeFakeSchedule({ scheduleOptions: { scheduleType: 'auto-refresh' } });
    await dbOperator.insert(fakeAutoRefreshSchedule, 'schedules');

    const scheduleWithNoValidType = 'ScheduleWithNoValidType';
    try {
      await getSchedulesBasedOnType({ params: { typeOfItemsToSchedule: scheduleWithNoValidType } });
    } catch (error) {
      expect(error.message).toBe(`No schedules with type ${scheduleWithNoValidType} found.`);
    }
  });

  after(async () => {
    await dbOperator.dropCollection('schedules');
  });
});
