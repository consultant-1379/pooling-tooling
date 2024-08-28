const expect = require('expect');

const { makeUpdateSchedule } = require('../../use-cases/update-schedule');
const {
  makeFakeSchedule,
} = require('../../../../__test__/fixtures/schedule.spec.js');
const { logger } = require('../../../../__test__/fixtures/logger.spec');
const { flattenObject } = require('../../../../utilities/index.js');

const updateSchedule = makeUpdateSchedule(logger, flattenObject);

describe('Unit Test: (Schedule service) Update schedule use case', () => {
  it('Schedule not found', () => {
    expect(() => makeUpdateSchedule(null).toThrow('Schedule not found'));
  });

  it('mocks the update of a schedule', () => {
    const fakeSchedule = makeFakeSchedule();
    delete fakeSchedule.modifiedOn;

    const scheduleOptions = {
      scheduleType: 'auto-refresh',
      cronSchedule: '0 3 * * *',
    };
    const updatedSchedule = updateSchedule([fakeSchedule], {
      scheduleOptions,
    }).$set;
    console.log(updatedSchedule);

    expect(updatedSchedule['scheduleOptions.scheduleType']).toEqual(
      scheduleOptions.scheduleType,
    );
    expect(updatedSchedule['scheduleOptions.cronSchedule']).toEqual(
      scheduleOptions.cronSchedule,
    );
    expect(updatedSchedule.modifiedOn).not.toEqual(fakeSchedule.modifiedOn);
  });

  it('mocks the update of a schedule full', () => {
    const fakeUpdates = makeFakeSchedule();
    delete fakeUpdates.modifiedOn;
    console.log(fakeUpdates);

    let updatedSchedule = updateSchedule([{ any: 'thing' }], fakeUpdates);
    console.log(fakeUpdates);

    updatedSchedule = updatedSchedule.$set;
    console.log(updatedSchedule);

    expect(updatedSchedule['scheduleOptions.scheduleType']).toEqual(
      fakeUpdates.scheduleOptions.scheduleType,
    );
    expect(updatedSchedule['scheduleOptions.cronSchedule']).toEqual(
      fakeUpdates.scheduleOptions.cronSchedule,
    );
    expect(updatedSchedule['scheduleOptions.projectArea']).toEqual(
      fakeUpdates.scheduleOptions.projectArea,
    );
    expect(
      updatedSchedule['refreshData.spinnakerPipelineApplicationName'],
    ).toEqual(fakeUpdates.refreshData.spinnakerPipelineApplicationName);
    expect(updatedSchedule['refreshData.spinnakerPipelineName']).toEqual(
      fakeUpdates.refreshData.spinnakerPipelineName,
    );
    expect(updatedSchedule['refreshData.itemsToScheduleIds']).toEqual(
      fakeUpdates.refreshData.itemsToScheduleIds,
    );
    expect(
      updatedSchedule['retentionPolicyData.retentionPolicyEnabled'],
    ).toEqual(fakeUpdates.retentionPolicyData.retentionPolicyEnabled);
    expect(
      updatedSchedule['retentionPolicyData.numOfStanbyEnvsToBeRetained'],
    ).toEqual(fakeUpdates.retentionPolicyData.numOfStanbyEnvsToBeRetained);
    expect(
      updatedSchedule['retentionPolicyData.numOfEiapReleaseForComparison'],
    ).toEqual(fakeUpdates.retentionPolicyData.numOfEiapReleaseForComparison);
    expect(updatedSchedule.modifiedOn).not.toEqual(fakeUpdates.modifiedOn);
    expect(updatedSchedule.scheduleName).toEqual(fakeUpdates.scheduleName);
    expect(updatedSchedule.scheduleEnabled).toEqual(
      fakeUpdates.scheduleEnabled,
    );
    expect(updatedSchedule.typeOfItemsToSchedule).toEqual(
      fakeUpdates.typeOfItemsToSchedule,
    );
    expect(updatedSchedule.createdOn).toBeFalsy();
    expect(updatedSchedule.id).toBeFalsy();
  });
});
