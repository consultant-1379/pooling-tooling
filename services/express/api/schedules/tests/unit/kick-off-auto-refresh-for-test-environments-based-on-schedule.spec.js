const expect = require('expect');

const { makeKickOffAutoRefreshForTestEnvironmentsBasedOnSchedule } = require('../../controllers/kick-off-auto-refresh-for-test-environments-based-on-schedule');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Schedule service) Kick off auto refresh for test environment based on schedule controller', () => {
  it('successfully kicks off the auto refresh pipeline and then returns true', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'test-environment',
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'pso',
      },
    });
    const fakeTestEnvironment = makeFakeTestEnvironment();

    let wasAutoRefreshFlowKickedOff = false;

    const kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule = makeKickOffAutoRefreshForTestEnvironmentsBasedOnSchedule(
      () => [fakeTestEnvironment],
      () => {
        wasAutoRefreshFlowKickedOff = true;
      },
      { info: () => 'Test log' },
    );

    const autoRefreshKickedOff = await kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule(fakeSchedule);
    expect(autoRefreshKickedOff).toBeTruthy();
    expect(wasAutoRefreshFlowKickedOff).toBeTruthy();
  });

  it('handles errors gracefully', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'test-environment',
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'pso',
      },
    });

    const errorMessage = 'Error occurred while fetching test environment';
    const expectedError = new Error(errorMessage);

    const kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule = makeKickOffAutoRefreshForTestEnvironmentsBasedOnSchedule(
      () => { throw expectedError; },
      () => {},
      { error: () => 'Test error log' },
    );
    try {
      await kickOffAutoRefreshForTestEnvironmentsBasedOnSchedule(fakeSchedule);
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
});
