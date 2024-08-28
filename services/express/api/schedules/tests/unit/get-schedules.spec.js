const expect = require('expect');

const { makeGetSchedules } = require('../../controllers/get-schedules');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');

describe('Unit Test: (Schedule service) Get schedules controller', () => {
  it('successfully gets schedules', async () => {
    const fakeSchedule = makeFakeSchedule();
    const getSchedules = makeGetSchedules({
      findAll: () => [fakeSchedule],
    }, { info: () => 'Test log' });
    const allSchedules = await getSchedules();
    expect(allSchedules).toEqual([fakeSchedule]);
  });
  it('unsuccessfully gets schedules', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const getSchedules = makeGetSchedules({
      findAll: () => {
        throw Error(expectedErrorMessage);
      },
    }, { info: () => 'Test log' });
    let actualErrorMessage;
    await getSchedules().catch(async (error) => {
      actualErrorMessage = error.message;
    })
      .then(async () => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
