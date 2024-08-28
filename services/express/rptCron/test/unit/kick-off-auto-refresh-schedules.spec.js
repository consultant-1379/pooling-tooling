const expect = require('expect');

const { makeKickOffAutoRefreshSchedules } = require('../../controllers/kick-off-auto-refresh-schedules');
const { makeFakeSchedule } = require('../../../__test__/fixtures/schedule.spec.js');

describe('Unit Test: (Cron service) Kick off auto refresh schedules controller', () => {
  it('must only call the controller for kicking off auto refresh for pools based on schedule when schedule enabled equals true', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleEnabled: true,
      scheduleOptions: { scheduleType: 'auto-refresh' },
    });
    let wasCodeToKickOffAutoRefreshForPoolsBasedOnScheduleHit = false;
    const wasCodeToKickOffAutoRefreshForTestEnvironmentsBasedOnScheduleHit = false;

    const kickOffAutoRefreshSchedules = makeKickOffAutoRefreshSchedules(
      () => [fakeSchedule],
      () => [fakeSchedule],
      () => {
        wasCodeToKickOffAutoRefreshForPoolsBasedOnScheduleHit = true;
      },
      () => undefined,
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );

    await kickOffAutoRefreshSchedules();
    expect(wasCodeToKickOffAutoRefreshForPoolsBasedOnScheduleHit).toBeTruthy();
    expect(wasCodeToKickOffAutoRefreshForTestEnvironmentsBasedOnScheduleHit).toBeFalsy();
  });

  it('must only call the controller for kicking off auto refresh for test environments based on schedule when schedule enabled equals true', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'test-environment',
      scheduleEnabled: true,
      scheduleOptions: { scheduleType: 'auto-refresh' },
    });
    const wasCodeToKickOffAutoRefreshForPoolsBasedOnScheduleHit = false;
    let wasCodeToKickOffAutoRefreshForTestEnvironmentsBasedOnScheduleHit = false;

    const kickOffAutoRefreshSchedules = makeKickOffAutoRefreshSchedules(
      () => [fakeSchedule],
      () => [fakeSchedule],
      () => undefined,
      () => {
        wasCodeToKickOffAutoRefreshForTestEnvironmentsBasedOnScheduleHit = true;
      },
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );

    await kickOffAutoRefreshSchedules();
    expect(wasCodeToKickOffAutoRefreshForPoolsBasedOnScheduleHit).toBeFalsy();
    expect(wasCodeToKickOffAutoRefreshForTestEnvironmentsBasedOnScheduleHit).toBeTruthy();
  });

  it('must not call the controller for kicking off auto refresh for pools based on schedule when schedule enabled equals false', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleEnabled: false,
      scheduleOptions: { scheduleType: 'auto-refresh' },
    });
    let wasScheduleEnabled = false;

    const kickOffAutoRefreshSchedules = makeKickOffAutoRefreshSchedules(
      () => [fakeSchedule],
      () => [fakeSchedule],
      (schedule) => { wasScheduleEnabled = schedule.scheduleEnabled; },
      () => undefined,
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );

    await kickOffAutoRefreshSchedules();
    expect(wasScheduleEnabled).toBeFalsy();
  });

  it('must not call the controller for kicking off auto refresh for test environments based on schedule when schedule enabled equals false', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'test-environment',
      scheduleEnabled: false,
      scheduleOptions: { scheduleType: 'auto-refresh' },
    });
    let wasScheduleEnabled = false;

    const kickOffAutoRefreshSchedules = makeKickOffAutoRefreshSchedules(
      () => [fakeSchedule],
      () => [fakeSchedule],
      () => undefined,
      (schedule) => { wasScheduleEnabled = schedule.scheduleEnabled; },
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );
    await kickOffAutoRefreshSchedules();
    expect(wasScheduleEnabled).toBeFalsy();
  });

  it('handles errors gracefully', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleEnabled: true,
      scheduleOptions: { scheduleType: 'auto-refresh' },
    });

    const errorMessage = 'Error occurred while fetching schedules';
    const expectedError = new Error(errorMessage);

    const kickOffAutoRefreshSchedules = makeKickOffAutoRefreshSchedules(
      () => { throw expectedError; },
      () => [fakeSchedule],
      () => {},
      () => {},
      { error: () => 'Test error log', logFormatter: () => {} },
    );

    try {
      await kickOffAutoRefreshSchedules();
    } catch (error) {
      expect(error).toEqual(expectedError);
    }
  });
});
