const expect = require('expect');

const { makeDeleteSchedule } = require('../../controllers/delete-schedule');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');

describe('Unit Test: (Schedule service) Remove schedule controller', () => {
  it('unsuccessfully removes a schedule', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';

    const fakeSchedule = makeFakeSchedule();
    const deleteSchedule = makeDeleteSchedule(
      {
        remove: () => {
          throw Error(expectedErrorMessage);
        },
      },
      { info: () => 'Test log' },
    );

    const request = {
      params: {
        id: fakeSchedule.id,
      },
    };

    let actualErrorMessage;
    await deleteSchedule(request).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
