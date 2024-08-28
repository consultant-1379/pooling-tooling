const expect = require('expect');

const { makePostSchedule } = require('../../controllers/post-schedule');
const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');

describe('Unit Test: (Schedule service) Post schedule controller', () => {
  it('successfully posts a schedule', async () => {
    const fakeSchedule = makeFakeSchedule();
    const postSchedule = makePostSchedule(
      () => fakeSchedule,
      { insert: () => fakeSchedule, findBySearchQuery: () => {} },
      {
        info: () => 'Test log',
        error: () => 'Test error',
        logFormatter: () => {},
      },
    );
    const request = {
      body: fakeSchedule,
    };

    const postedSchedule = await postSchedule(request);
    expect(postedSchedule).toEqual(fakeSchedule);
  });

  it('unsuccessfully posts a schedule', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';

    const fakeSchedule = makeFakeSchedule();
    const postSchedule = makePostSchedule(
      () => {
        throw Error(expectedErrorMessage);
      },
      { insert: () => fakeSchedule, findBySearchQuery: () => {} },
      {
        info: () => 'Test log',
        error: () => 'Test error',
        logFormatter: () => {},
      },
    );
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: fakeSchedule,
    };
    let actualErrorMessage;
    await postSchedule(request).catch(async (error) => {
      actualErrorMessage = error.message;
    })
      .then(async () => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
