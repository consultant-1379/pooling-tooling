const expect = require('expect');
const sinon = require('sinon');

const {
  makeKickOffAutoRefreshForPoolsBasedOnSchedule,
} = require('../../controllers/kick-off-auto-refresh-for-pools-based-on-schedule');
const {
  makeFakeSchedule,
} = require('../../../../__test__/fixtures/schedule.spec.js');
const {
  makeFakeTestEnvironment,
} = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Unit Test: (Schedule service) Kick off auto refresh for pool based on schedule controller', () => {
  const fakeTestEnvironment = makeFakeTestEnvironment({ status: 'Standby' });
  const fakePool = makeFakePool({
    assignedTestEnvironmentIds: [fakeTestEnvironment.id],
  });
  let wasAutoRefreshFlowKickedOff = false;

  let mockLogger;
  beforeEach(() => {
    sinon.restore();
    mockLogger = {
      info: sinon.spy(),
      error: sinon.spy(),
    };
  });
  it('successfully kicks off the auto refresh pipeline and then returns true', async () => {
    const fakeSchedule = makeFakeSchedule({ typeOfItemsToSchedule: 'pool' });

    wasAutoRefreshFlowKickedOff = false;

    const kickOffAutoRefreshForPoolsBasedOnSchedule = makeKickOffAutoRefreshForPoolsBasedOnSchedule(
      () => [fakePool],
      () => [fakeTestEnvironment.id],
      () => [fakeTestEnvironment],
      { info: () => 'Test log', error: () => 'Test error log' },
      () => {
        wasAutoRefreshFlowKickedOff = true;
      },
      () => ['2.7.0-149', '2.7.0-148', '2.7.0-147', '2.7.0-146', '2.7.0-145'],
    );

    const autoRefreshKickedOff = await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);
    expect(autoRefreshKickedOff).toBeTruthy();
    expect(wasAutoRefreshFlowKickedOff).toBeTruthy();
  });

  it('successfully kicks off the auto refresh pipeline then returns true when project area set to pso', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'pso',
      },
    });

    wasAutoRefreshFlowKickedOff = false;

    const kickOffAutoRefreshForPoolsBasedOnSchedule = makeKickOffAutoRefreshForPoolsBasedOnSchedule(
      () => [fakePool],
      () => [fakeTestEnvironment.id],
      () => [fakeTestEnvironment],
      { info: () => 'Test log', error: () => 'Test error log' },
      () => {
        wasAutoRefreshFlowKickedOff = true;
      },
      () => ['2.7.0-149', '2.7.0-148', '2.7.0-147', '2.7.0-146', '2.7.0-145'],
    );

    const autoRefreshKickedOff = await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);
    expect(autoRefreshKickedOff).toBeTruthy();
    expect(wasAutoRefreshFlowKickedOff).toBeTruthy();
  });
  it('successfully kicks off the auto refresh pipeline then returns true when project area set to release', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'release',
      },
    });

    wasAutoRefreshFlowKickedOff = false;

    const kickOffAutoRefreshForPoolsBasedOnSchedule = makeKickOffAutoRefreshForPoolsBasedOnSchedule(
      () => [fakePool],
      () => [fakeTestEnvironment.id],
      () => [fakeTestEnvironment],
      { info: () => 'Test log', error: () => 'Test error log' },
      () => {
        wasAutoRefreshFlowKickedOff = true;
      },
      () => ['2.7.0-149', '2.7.0-148', '2.7.0-147', '2.7.0-146', '2.7.0-145'],
    );

    const autoRefreshKickedOff = await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);
    expect(autoRefreshKickedOff).toBeTruthy();
    expect(wasAutoRefreshFlowKickedOff).toBeTruthy();
  });
  it('successfully kicks off the auto refresh pipeline then returns true when project area set to prod-eng', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'prod-eng',
      },
    });

    wasAutoRefreshFlowKickedOff = false;

    const kickOffAutoRefreshForPoolsBasedOnSchedule = makeKickOffAutoRefreshForPoolsBasedOnSchedule(
      () => [fakePool],
      () => [fakeTestEnvironment.id],
      () => [fakeTestEnvironment],
      { info: () => 'Test log', error: () => 'Test error log' },
      () => {
        wasAutoRefreshFlowKickedOff = true;
      },
      () => ['2.7.0-149', '2.7.0-148', '2.7.0-147', '2.7.0-146', '2.7.0-145'],
    );

    const autoRefreshKickedOff = await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);
    expect(autoRefreshKickedOff).toBeTruthy();
    expect(wasAutoRefreshFlowKickedOff).toBeTruthy();
  });
  it('throws an error when project area set to prod-eng and environment already on latest version', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'prod-eng',
      },
    });

    const fakeTestEnvironment1 = makeFakeTestEnvironment({
      status: 'Standby',
      properties: {
        version: '2.7.0-149',
      },
    });

    wasAutoRefreshFlowKickedOff = false;

    const kickOffAutoRefreshForPoolsBasedOnSchedule = makeKickOffAutoRefreshForPoolsBasedOnSchedule(
      () => [fakePool],
      () => [fakeTestEnvironment1.id],
      () => [fakeTestEnvironment1],
      mockLogger,
      () => {
        wasAutoRefreshFlowKickedOff = false;
      },
      () => ['2.7.0-149', '2.7.0-148', '2.7.0-147', '2.7.0-146', '2.7.0-145'],
    );
    await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);

    const expected = {
      errorInfo: {
        message:
          'No test environments identified that require refreshing. Refresh pipeline will not be triggered.',
      },
      loggingTags: {
        req: {},
        res: {},
        service: 'Schedules (controller)',
        action: 'kickOffAutoRefreshForPoolsBasedOnSchedule',
        actionParameters: {},
      },
    };
    sinon.assert.calledWith(mockLogger.error, expected);
  });

  it('throws an error when project area set to prod-eng and environment is NOT in Standby', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'prod-eng',
      },
    });

    const fakeTestEnvironment1 = makeFakeTestEnvironment({
      status: 'Reserved',
      properties: {
        version: '2.4.0-138',
      },
    });

    wasAutoRefreshFlowKickedOff = false;

    const kickOffAutoRefreshForPoolsBasedOnSchedule = makeKickOffAutoRefreshForPoolsBasedOnSchedule(
      () => [fakePool],
      () => [fakeTestEnvironment1.id],
      () => [fakeTestEnvironment1],
      mockLogger,
      () => {
        wasAutoRefreshFlowKickedOff = false;
      },
      () => ['2.7.0-149', '2.7.0-148', '2.7.0-147', '2.7.0-146', '2.7.0-145'],
    );

    await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);

    const expected = {
      errorInfo: {
        message:
          'No test environments identified that require refreshing. Refresh pipeline will not be triggered.',
      },
      loggingTags: {
        req: {},
        res: {},
        service: 'Schedules (controller)',
        action: 'kickOffAutoRefreshForPoolsBasedOnSchedule',
        actionParameters: {},
      },
    };
    sinon.assert.calledWith(mockLogger.error, expected);
  });

  it('throws an error when NO test environments are identified for refreshing', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      retentionPolicyData: {
        retentionPolicyEnabled: true,
        numOfStanbyEnvsToBeRetained: 1,
        numOfEiapReleaseForComparison: 2,
      },
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'pso',
      },
    });

    wasAutoRefreshFlowKickedOff = false;

    const kickOffAutoRefreshForPoolsBasedOnSchedule = makeKickOffAutoRefreshForPoolsBasedOnSchedule(
      () => [fakePool],
      () => [],
      () => [],
      mockLogger,
      () => {
        wasAutoRefreshFlowKickedOff = false;
      },
      () => ['2.7.0-149', '2.7.0-148', '2.7.0-147', '2.7.0-146', '2.7.0-145'],
    );

    await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);
    const expected = {
      errorInfo: {
        message:
          'No test environments identified that require refreshing. Refresh pipeline will not be triggered.',
      },
      loggingTags: {
        req: {},
        res: {},
        service: 'Schedules (controller)',
        action: 'kickOffAutoRefreshForPoolsBasedOnSchedule',
        actionParameters: {},
      },
    };
    sinon.assert.calledWith(mockLogger.error, expected);
  });

  it('successfully kicks off the auto refresh pipeline then returns true with project area passed to auto refresh flow', async () => {
    const fakeSchedule = makeFakeSchedule({
      typeOfItemsToSchedule: 'pool',
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'pso',
      },
    });

    let refreshedTestEnvironment;
    let refreshedSpinnakerPipelineApplicationName;
    let refreshedSpinnakerPipelineName;

    const kickOffAutoRefreshForPoolsBasedOnSchedule = makeKickOffAutoRefreshForPoolsBasedOnSchedule(
      () => [fakePool],
      () => [fakeTestEnvironment.id],
      () => [fakeTestEnvironment],
      { info: () => 'Test log', error: () => 'Test error log' },
      (
        testEnvironment,
        spinnakerPipelineApplicationName,
        spinnakerPipelineName,
      ) => {
        refreshedTestEnvironment = testEnvironment;
        refreshedSpinnakerPipelineApplicationName = spinnakerPipelineApplicationName;
        refreshedSpinnakerPipelineName = spinnakerPipelineName;
      },
      () => ['2.7.0-149', '2.7.0-148', '2.7.0-147', '2.7.0-146', '2.7.0-145'],
    );

    const autoRefreshKickedOff = await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);
    expect(autoRefreshKickedOff).toBeTruthy();
    expect(refreshedTestEnvironment).toStrictEqual(fakeTestEnvironment);
    expect(refreshedSpinnakerPipelineApplicationName).toStrictEqual(
      'thunderbeetest',
    );
    expect(refreshedSpinnakerPipelineName).toStrictEqual(
      'Fake_Test_Refresh_Flow_Fake',
    );
  });
});
