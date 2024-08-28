const expect = require('expect');

const { makeGetSchedulesBasedOnType } = require('../../controllers/get-schedules-based-on-type');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');

describe('Unit Test: (Schedule service) Get schedules based on type use case', () => {
  it('should get all required schedules based on the type', async () => {
    const fakeSchedule = makeFakeSchedule({ scheduleOptions: { scheduleType: 'auto-refresh' } });

    const getSchedulesBasedOnType = makeGetSchedulesBasedOnType(
      { findBySearchQuery: () => [fakeSchedule] },
      { info: () => 'Test log', logFormatter: () => {} },
    );

    const autoRefreshSchedules = await getSchedulesBasedOnType({ params: { typeOfItemsToSchedule: 'auto-refresh' } });
    expect(autoRefreshSchedules).toBeTruthy();
    expect(autoRefreshSchedules).toHaveLength(1);
  });

  it('should throw an error if no schedules are returned based on the type', async () => {
    const getSchedulesBasedOnType = makeGetSchedulesBasedOnType(
      { findBySearchQuery: () => [] },
      { info: () => 'Test log', error: () => 'Test error log' },
    );

    const scheduleWithNoValidType = 'ScheduleWithNoValidType';

    try {
      await getSchedulesBasedOnType({ params: { typeOfItemsToSchedule: scheduleWithNoValidType } });
    } catch (error) {
      expect(error.message).toBe(`No schedules with type ${scheduleWithNoValidType} found.`);
    }
  });
});
