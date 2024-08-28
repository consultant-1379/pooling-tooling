const expect = require('expect');

const { makeKickOffAutoTriggerForTestEnvironmentsBasedOnSchedule } = require('../../controllers/kick-off-auto-trigger-for-test-environments-based-on-schedule');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Schedule service) Kick off auto trigger for test environment based on schedule controller', () => {
  it('successfully kicks off the auto trigger pipeline and then returns true', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'test-environment',
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'pso',
      },
    });
    const fakeTestEnvironment = makeFakeTestEnvironment();

    let wasAutoTriggerFlowKickedOff = false;

    const kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule = makeKickOffAutoTriggerForTestEnvironmentsBasedOnSchedule(
      () => [fakeTestEnvironment],
      () => {
        wasAutoTriggerFlowKickedOff = true;
      },
      { info: () => 'Test log' },
    );

    const autoTriggerKickedOff = await kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule(fakeSchedule);
    expect(autoTriggerKickedOff).toBeTruthy();
    expect(wasAutoTriggerFlowKickedOff).toBeTruthy();
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

    const kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule = makeKickOffAutoTriggerForTestEnvironmentsBasedOnSchedule(
      () => { throw expectedError; },
      () => {},
      { error: () => 'Test error log' },
    );

    try {
      await kickOffAutoTriggerForTestEnvironmentsBasedOnSchedule(fakeSchedule);
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
});
