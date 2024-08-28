const expect = require('expect');

const { makeCreateSchedule } = require('../../use-cases/create-schedule');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');

describe('Unit Test: (Schedule service) Create schedule use case', () => {
  it('must throw the appropriate error if scheduleInfo is empty', () => {
    const fakeSchedule = null;
    const createSchedule = makeCreateSchedule(() => true, { info: () => 'Test log', error: () => 'Test error log' });
    expect(() => createSchedule([], fakeSchedule)).toThrow(
      'Schedule information is empty',
    );
  });

  it('must throw the appropriate error if schedule already exists', () => {
    const fakeScheduleName = 'schedule1';
    const fakeSchedule = makeFakeSchedule({ scheduleName: fakeScheduleName });
    const createSchedule = makeCreateSchedule(() => true, { info: () => 'Test log', error: () => 'Test error log' });
    expect(() => createSchedule([fakeSchedule], fakeSchedule)).toThrow(
      `A schedule named ${fakeScheduleName} already exists. Not creating new schedule with the same name.`,
    );
  });

  it('mocks the creation of a schedule', () => {
    const fakeSchedule = makeFakeSchedule();
    const fakeCreatedSchedule = Object.freeze({
      getId: () => fakeSchedule.id,
      getScheduleName: () => fakeSchedule.scheduleName,
      getScheduleEnabled: () => fakeSchedule.scheduleEnabled,
      getTypeOfItemsToSchedule: () => fakeSchedule.typeOfItemsToSchedule,
      getRefreshData: () => fakeSchedule.refreshData,
      getRetentionPolicyData: () => fakeSchedule.retentionPolicyData,
      getScheduleOptions: () => fakeSchedule.scheduleOptions,
      getCreatedOn: () => fakeSchedule.createdOn,
      getModifiedOn: () => fakeSchedule.modifiedOn,
    });
    const createSchedule = makeCreateSchedule(() => fakeCreatedSchedule, { info: () => 'Test log' });

    const createdSchedule = createSchedule([], fakeSchedule);

    expect(createdSchedule).toEqual(fakeSchedule);
  });
});
