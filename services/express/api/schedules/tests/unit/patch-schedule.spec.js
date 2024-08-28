const expect = require('expect');

const { makePatchSchedule } = require('../../controllers/patch-schedule');

const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');
const { logger } = require('../../../../__test__/fixtures/logger.spec');

describe('Unit Test: (Schedule service) Patch schedule controller', () => {
  const emitter = { emit: () => {} };
  it('successfully patches a schedule', async () => {
    const fakeSchedule = makeFakeSchedule();
    const patchSchedule = makePatchSchedule(
      () => fakeSchedule,
      { findOneAndUpdate: () => fakeSchedule, findById: () => fakeSchedule },
      () => emitter,
      logger,
    );
    const request = {
      params: {
        id: fakeSchedule.id,
      },
      body: fakeSchedule,
    };

    const patchedSchedule = await patchSchedule(request);
    expect(patchedSchedule).toEqual(fakeSchedule);
  });

  it('unsuccessfully patches a schedule', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const fakeSchedule = makeFakeSchedule();
    const patchSchedule = makePatchSchedule(
      () => {
        throw Error(expectedErrorMessage);
      },
      { findOneAndUpdate: () => fakeSchedule, findById: () => fakeSchedule },
      () => emitter,
      logger,
    );

    const request = {
      params: {
        id: fakeSchedule.id,
      },
      body: fakeSchedule,
    };

    let actualErrorMessage;
    await patchSchedule(request).catch(async (error) => {
      actualErrorMessage = error.message;
    })
      .then(async () => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
