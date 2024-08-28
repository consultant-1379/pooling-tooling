const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { deleteSchedule } = require('../../controllers');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');

describe('Integration Test: (Schedule service) Remove schedule controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('schedules');
  });

  it('successfully removes a schedule', async () => {
    const fakeSchedule = makeFakeSchedule();
    await dbOperator.insert(fakeSchedule, 'schedules');

    const fakeHttpRequest = {
      params: {
        id: fakeSchedule.id,
      },
    };

    await deleteSchedule(fakeHttpRequest);

    const scheduleFromDbAfterDeleting = await dbOperator.findAll('schedules');
    expect(scheduleFromDbAfterDeleting.length).toEqual(0);
  });

  after(async () => {
    await dbOperator.dropCollection('schedules');
  });
});
