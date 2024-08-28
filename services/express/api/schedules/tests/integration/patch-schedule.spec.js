const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');
const { patchSchedule } = require('../../controllers');
const { makePatchSchedule } = require('../../controllers/patch-schedule');
const { updateSchedule } = require('../../use-cases');

const logger = require('../../../../logger/logger');

describe('Integration Test: (Schedule service) Patch schedule controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('schedules');
  });

  it('successfully updates a schedule', async () => {
    const fakeSchedule = makeFakeSchedule();
    await dbOperator.insert(fakeSchedule, 'schedules');

    const fakeHttpRequest = {
      body: {
        scheduleOptions: {
          scheduleType: 'auto-refresh',
          cronSchedule: '0 3 * * *',
          projectArea: 'release',
        },
      },
      params: {
        id: fakeSchedule.id,
      },
    };

    const patchedSchedule = await patchSchedule(fakeHttpRequest);
    expect(patchedSchedule.scheduleOptions.cronSchedule).toEqual('0 3 * * *');
  });

  it('should throw an error if no schedule is found', async () => {
    const fakeHttpRequest = {
      body: {
        scheduleOptions: {
          scheduleType: 'auto-refresh',
          cronSchedule: '0 3 * * *',
          projectArea: 'release',
        },
      },
      params: {
        id: 'idDoesNotExist',
      },
    };

    const expectedErrorMessage = 'Schedule not found';
    let actualErrorMessage;
    await patchSchedule(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('should ensure the event emitter is called correctly by the patch schedule function', async () => {
    let wasEmitterCalled = false;

    const fakeSchedule = makeFakeSchedule();
    await dbOperator.insert(fakeSchedule, 'schedules');

    const patchScheduleMock = makePatchSchedule(
      updateSchedule,
      dbOperator,
      {
        emitter: {
          emit: () => {
            wasEmitterCalled = true;
          },
        },
      },
      logger,
    );

    const fakeHttpRequest = {
      body: {
        scheduleOptions: {
          scheduleType: 'auto-refresh',
          cronSchedule: '0 3 * * *',
          projectArea: 'release',
        },
      },
      params: {
        id: fakeSchedule.id,
      },
    };
    await patchScheduleMock(fakeHttpRequest);
    expect(wasEmitterCalled).toBeTruthy();
  });

  after(async () => {
    await dbOperator.dropCollection('schedules');
  });
});
