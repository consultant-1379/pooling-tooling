const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { postSchedule } = require('../../controllers');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');

describe('Integration Test: (Schedule service) Post schedule controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('schedules');
  });

  it('successfully posts a schedule', async () => {
    const fakeSchedule = makeFakeSchedule();
    const fakeHttpRequest = {
      body: fakeSchedule,
    };
    const postedSchedule = await postSchedule(fakeHttpRequest);
    expect(postedSchedule.id).toEqual(fakeSchedule.id);
    expect(postedSchedule.scheduleName).toEqual(fakeSchedule.scheduleName);
    expect(postedSchedule.scheduleEnabled).toEqual(fakeSchedule.scheduleEnabled);
    expect(postedSchedule.refreshData).toEqual(fakeSchedule.refreshData);
    expect(postedSchedule.typeOfItemsToSchedule).toEqual(fakeSchedule.typeOfItemsToSchedule);
    expect(postedSchedule.retentionPolicyData).toEqual(fakeSchedule.retentionPolicyData);
    expect(postedSchedule.scheduleOptions).toEqual(fakeSchedule.scheduleOptions);
  });

  it('should throw an error if a schedule with the provided name already exists', async () => {
    const fakeSchedule = makeFakeSchedule({ scheduleName: 'TEST' });
    await dbOperator.insert(fakeSchedule, 'schedules');

    const fakeHttpRequest = {
      body: fakeSchedule,
    };

    const expectedErrorMessage = `A schedule named ${fakeSchedule.scheduleName} already exists. Not creating new schedule with the same name.`;
    let actualErrorMessage;
    await postSchedule(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  after(async () => {
    await dbOperator.dropCollection('schedules');
  });
});
