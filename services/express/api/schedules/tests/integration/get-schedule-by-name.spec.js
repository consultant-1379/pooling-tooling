const expect = require('expect');

const { getScheduleByName } = require('../../controllers');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Schedule service) Get schedule by name controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('schedules');
  });

  it('successfully gets a schedule by name', async () => {
    const fakeSchedule = makeFakeSchedule();
    await dbOperator.insert(fakeSchedule, 'schedules');
    const fakeHttpRequest = {
      params: {
        name: fakeSchedule.scheduleName,
      },
    };

    const getScheduleByNameResponse = await getScheduleByName(fakeHttpRequest);
    expect(getScheduleByNameResponse).toEqual([fakeSchedule]);
  });

  it('returns empty if no schedule with name exists', async () => {
    const fakeHttpRequest = {
      params: {
        name: 'dummy',
      },
    };
    const getScheduleByNameResponse = await getScheduleByName(fakeHttpRequest);
    expect(getScheduleByNameResponse).toEqual([]);
  });

  it('returns 409 if more than one schedule with the same name exists', async () => {
    const fakeSchedule = makeFakeSchedule({ scheduleName: 'iExist' });
    const anotherFakeSchedule = makeFakeSchedule({ scheduleName: 'iExist' });
    await dbOperator.insert(fakeSchedule, 'schedules');
    await dbOperator.insert(anotherFakeSchedule, 'schedules');
    const fakeHttpRequest = {
      params: {
        name: fakeSchedule.scheduleName,
      },
    };

    const expectedErrorMessage = `More than one Schedule found with name ${fakeSchedule.scheduleName}.`;
    await getScheduleByName(fakeHttpRequest).catch((error) => {
      expect(error.status).toEqual(409);
      expect(error.message).toEqual(expectedErrorMessage);
    });
  });

  after(async () => {
    await dbOperator.dropCollection('schedules');
  });
});
