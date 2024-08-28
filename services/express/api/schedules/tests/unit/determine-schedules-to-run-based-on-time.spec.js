const expect = require('expect');

const { makeDetermineSchedulesToRunBasedOnTime } = require('../../use-cases/determine-schedules-to-run-based-on-time');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');

describe('Unit Test: (Schedule service) Determine schedules to run based on time use case', () => {
  it('should take in list of schedules and only return those where the cronSchedule matches current time', () => {
    const scheduleOne = makeFakeSchedule({ scheduleOptions: { cronSchedule: '0 */2 * * *' } });

    const listOfSchedules = [scheduleOne];
    const determineSchedulesToRunBasedOnTime = makeDetermineSchedulesToRunBasedOnTime(
      () => '02:00',
      {
        parseExpression: () => ({
          prev: () => ({
            toISOString: () => ({
              substring: () => '02:00',
            }),
          }),
        }),
      },
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );

    const schedulesBasedOnTime = determineSchedulesToRunBasedOnTime(listOfSchedules);
    expect(schedulesBasedOnTime).toHaveLength(1);
    expect(schedulesBasedOnTime).toContain(scheduleOne);
  });

  it('should take in list of schedules and return no schedule if cronSchedule does not match the current time', () => {
    const scheduleOne = makeFakeSchedule({ scheduleOptions: { cronSchedule: '17:00' } });
    const scheduleTwo = makeFakeSchedule({ scheduleOptions: { cronSchedule: '18:00' } });
    const scheduleThree = makeFakeSchedule({ scheduleOptions: { cronSchedule: '19:00' } });
    const scheduleFour = makeFakeSchedule({ scheduleOptions: { cronSchedule: '20:00' } });

    const listOfSchedules = [scheduleOne, scheduleTwo, scheduleThree, scheduleFour];
    const determineSchedulesToRunBasedOnTime = makeDetermineSchedulesToRunBasedOnTime(
      () => '21:00',
      {
        parseExpression: () => ({
          prev: () => ({
            toISOString: () => ({
              substring: () => '02:00',
            }),
          }),
        }),
      },
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );

    const schedulesBasedOnTime = determineSchedulesToRunBasedOnTime(listOfSchedules);
    expect(schedulesBasedOnTime).toEqual([]);
    expect(schedulesBasedOnTime).toHaveLength(0);
  });

  it('should handle errors when parsing cron expressions', () => {
    const scheduleOne = makeFakeSchedule({ scheduleOptions: { cronSchedule: '0 */2 * * *' } });

    const listOfSchedules = [scheduleOne];
    const errorMessage = 'Error parsing cron expression';
    const expectedError = new Error(errorMessage);

    const determineSchedulesToRunBasedOnTime = makeDetermineSchedulesToRunBasedOnTime(
      () => '02:00',
      {
        parseExpression: () => {
          throw expectedError;
        },
      },
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );

    try {
      determineSchedulesToRunBasedOnTime(listOfSchedules);
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
});
