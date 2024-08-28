const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');
const { getSchedules } = require('../../controllers');

describe('Integration Test: (Schedule service) Get schedules controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('schedules');
  });

  it('successfully gets schedules', async () => {
    const fakeSchedule = makeFakeSchedule();
    const fakeAnotherSchedule = makeFakeSchedule();
    await dbOperator.insert(fakeSchedule, 'schedules');
    await dbOperator.insert(fakeAnotherSchedule, 'schedules');

    const allSchedules = await getSchedules();
    expect(allSchedules.length).toEqual(2);
    expect(allSchedules[0]).toEqual(fakeSchedule);
    expect(allSchedules[1]).toEqual(fakeAnotherSchedule);

    const schedulesFromDb = await dbOperator.findAll('schedules');
    expect(schedulesFromDb.length).toEqual(2);
  });

  it('returns empty array if no schedules are found', async () => {
    const allSchedules = await getSchedules();
    expect(allSchedules).toEqual([]);
  });

  after(async () => {
    await dbOperator.dropCollection('schedules');
  });
});
