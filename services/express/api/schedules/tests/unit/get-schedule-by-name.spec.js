const expect = require('expect');

const { makeGetScheduleByName } = require('../../controllers/get-schedule-by-name');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');

describe('Unit Test: (Schedule service) Get schedule by name controller', () => {
  it('successfully gets a schedule by name', async () => {
    const fakeSchedule = makeFakeSchedule();
    const getScheduleByName = makeGetScheduleByName({
      findBySearchQuery: () => [fakeSchedule],
    },
    { info: () => 'Test log', logFormatter: () => {} });
    const fakeHttpRequest = {
      params: {
        name: fakeSchedule.scheduleName,
      },
    };

    const getScheduleByNameResponse = await getScheduleByName(fakeHttpRequest);
    expect(getScheduleByNameResponse).toEqual([fakeSchedule]);
  });

  it('returns empty if no schedule with name exists', async () => {
    const getScheduleByName = makeGetScheduleByName({
      findBySearchQuery: () => [],
    }, { info: () => 'Test log', logFormatter: () => {} });
    const fakeHttpRequest = {
      params: {
        name: 'dummy',
      },
    };
    const getScheduleByNameResponse = await getScheduleByName(fakeHttpRequest);
    expect(getScheduleByNameResponse).toEqual([]);
  });

  it('returns 409 if more than one schedule with the same name exists', async () => {
    const fakeSchedule = makeFakeSchedule();
    const getScheduleByName = makeGetScheduleByName({
      findBySearchQuery: () => [fakeSchedule, fakeSchedule],
    }, { info: () => 'Test log', error: () => 'Test error log', logFormatter: () => {} });
    const fakeHttpRequest = {
      params: {
        scheduleName: fakeSchedule.scheduleName,
      },
    };

    const expectedErrorMessage = `More than one Schedule found with name ${fakeSchedule.name}.`;
    await getScheduleByName(fakeHttpRequest).catch((error) => {
      expect(error.status).toEqual(409);
      expect(error.message).toEqual(expectedErrorMessage);
    });
  });
});
