const expect = require('expect');

const { makeKickOffAutoTriggerSchedules } = require('../../controllers/kick-off-auto-trigger-schedules');
const { makeFakeSchedule } = require('../../../__test__/fixtures/schedule.spec.js');

describe('Unit Test: (Cron service) Kick off auto trigger schedules controller', () => {
  it('must only call the controller for kicking off auto trigger for pools based on schedule when schedule enabled equals true', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleEnabled: true,
      scheduleOptions: { scheduleType: 'auto-trigger' },
    });
    let wasCodeToKickOffAutoTriggerForPoolsBasedOnScheduleHit = false;
    const wasCodeToKickOffAutoTriggerForTestEnvironmentsBasedOnScheduleHit = false;

    const kickOffAutoTriggerSchedules = makeKickOffAutoTriggerSchedules(
      () => [fakeSchedule],
      () => [fakeSchedule],
      () => {
        wasCodeToKickOffAutoTriggerForPoolsBasedOnScheduleHit = true;
      },
      () => undefined,
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );

    await kickOffAutoTriggerSchedules();
    expect(wasCodeToKickOffAutoTriggerForPoolsBasedOnScheduleHit).toBeTruthy();
    expect(wasCodeToKickOffAutoTriggerForTestEnvironmentsBasedOnScheduleHit).toBeFalsy();
  });

  it('must only call the controller for kicking off auto trigger for test environments based on schedule when schedule enabled equals true', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'test-environment',
      scheduleEnabled: true,
      scheduleOptions: { scheduleType: 'auto-trigger' },
    });
    const wasCodeToKickOffAutoTriggerForPoolsBasedOnScheduleHit = false;
    let wasCodeToKickOffAutoTriggerForTestEnvironmentsBasedOnScheduleHit = false;

    const kickOffAutoTriggerSchedules = makeKickOffAutoTriggerSchedules(
      () => [fakeSchedule],
      () => [fakeSchedule],
      () => undefined,
      () => {
        wasCodeToKickOffAutoTriggerForTestEnvironmentsBasedOnScheduleHit = true;
      },
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );

    await kickOffAutoTriggerSchedules();
    expect(wasCodeToKickOffAutoTriggerForPoolsBasedOnScheduleHit).toBeFalsy();
    expect(wasCodeToKickOffAutoTriggerForTestEnvironmentsBasedOnScheduleHit).toBeTruthy();
  });

  it('must not call the controller for kicking off auto trigger for pools based on schedule when schedule enabled equals false', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleEnabled: false,
      scheduleOptions: { scheduleType: 'auto-trigger' },
    });
    let wasScheduleEnabled = false;

    const kickOffAutoTriggerSchedules = makeKickOffAutoTriggerSchedules(
      () => [fakeSchedule],
      () => [fakeSchedule],
      (schedule) => { wasScheduleEnabled = schedule.scheduleEnabled; },
      () => undefined,
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );

    await kickOffAutoTriggerSchedules();
    expect(wasScheduleEnabled).toBeFalsy();
  });

  it('must not call the controller for kicking off auto trigger for test environments based on schedule when schedule enabled equals false', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'test-environment',
      scheduleEnabled: false,
      scheduleOptions: { scheduleType: 'auto-trigger' },
    });
    let wasScheduleEnabled = false;

    const kickOffAutoTriggerSchedules = makeKickOffAutoTriggerSchedules(
      () => [fakeSchedule],
      () => [fakeSchedule],
      () => undefined,
      (schedule) => { wasScheduleEnabled = schedule.scheduleEnabled; },
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );
    await kickOffAutoTriggerSchedules();
    expect(wasScheduleEnabled).toBeFalsy();
  });

  it('handles errors gracefully', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleEnabled: true,
      scheduleOptions: { scheduleType: 'auto-trigger' },
    });

    const errorMessage = 'Error occurred while fetching schedules';
    const expectedError = new Error(errorMessage);

    const kickOffAutoTriggerSchedules = makeKickOffAutoTriggerSchedules(
      () => { throw expectedError; },
      () => [fakeSchedule],
      () => {},
      () => {},
      { error: () => 'Test error log', logFormatter: () => {} },
    );

    try {
      await kickOffAutoTriggerSchedules();
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
});
