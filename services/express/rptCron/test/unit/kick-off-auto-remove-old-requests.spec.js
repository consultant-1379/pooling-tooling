const expect = require('expect');

const { makeKickOffAutoRemoveOldRequests } = require('../../controllers/kick-off-auto-remove-old-requests');

describe('Unit Test: (Cron service) Kick off auto remove old requests schedules controller', () => {
  it('must reach end of cron task when no requests exist older than 60 days', async () => {
    const kickOffAutoRemoveOldRequests = makeKickOffAutoRemoveOldRequests(
      { info: () => {} },
      {
        findByAggregation: () => [],
        remove: () => {},
      },
      {},
    );

    const wasKickedOff = await kickOffAutoRemoveOldRequests();
    expect(wasKickedOff).toBeTruthy();
  });

  it('must not remove requests if no requests exist older than 60 days', async () => {
    let wasRemoveOperationPerformed = false;

    const kickOffAutoRemoveOldRequests = makeKickOffAutoRemoveOldRequests(
      { info: () => {} },
      {
        findByAggregation: () => [],
        findById: () => [],
        remove: () => { wasRemoveOperationPerformed = true; },
      },
      {},
    );

    await kickOffAutoRemoveOldRequests();
    expect(wasRemoveOperationPerformed).not.toBeTruthy();
  });

  it('must reach end of cron task when requests exist older than 60 days', async () => {
    const kickOffAutoRemoveOldRequests = makeKickOffAutoRemoveOldRequests(
      { info: () => {} },
      {
        findByAggregation: () => [{}],
        findById: () => [{}],
        remove: () => {},
      },
      {},
    );

    const wasKickedOff = await kickOffAutoRemoveOldRequests();
    expect(wasKickedOff).toBeTruthy();
  });

  it('must remove old requests if requests exist older than 60 days and no test environments associated', async () => {
    let wasRemoveOperationPerformed = false;

    const kickOffAutoRemoveOldRequests = makeKickOffAutoRemoveOldRequests(
      { info: () => {} },
      {
        findByAggregation: () => [{}],
        findById: () => [],
        remove: () => { wasRemoveOperationPerformed = true; },
      },
      {},
    );

    await kickOffAutoRemoveOldRequests();
    expect(wasRemoveOperationPerformed).toBeTruthy();
  });

  it('must not remove old requests if requests exist older than 60 days and test environments associated', async () => {
    let wasRemoveOperationPerformed = false;

    const kickOffAutoRemoveOldRequests = makeKickOffAutoRemoveOldRequests(
      { info: () => {} },
      {
        findByAggregation: () => [{}],
        findById: () => [{}],
        remove: () => { wasRemoveOperationPerformed = true; },
      },
      {},
    );

    await kickOffAutoRemoveOldRequests();
    expect(wasRemoveOperationPerformed).not.toBeTruthy();
  });
});
