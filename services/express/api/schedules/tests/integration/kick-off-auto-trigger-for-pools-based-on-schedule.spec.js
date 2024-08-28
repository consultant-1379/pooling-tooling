const expect = require('expect');
const sinon = require('sinon');
const { dbOperator } = require('../../../../data-access');

const {
  makeFakeSchedule,
} = require('../../../../__test__/fixtures/schedule.spec.js');
const {
  makeFakeTestEnvironment,
} = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const {
  makeKickOffAutoTriggerForPoolsBasedOnSchedule,
} = require('../../controllers/kick-off-auto-trigger-for-pools-based-on-schedule');

const { getPoolById } = require('../../../pools/controllers');
const {
  getTestEnvironment,
} = require('../../../test-environments/controllers');
const { kickOffSpinnakerFlow } = require('../../use-cases');

describe('Integration Test: (Schedule service) Kick off auto trigger for pool based on schedule controller', () => {
  let kickOffAutoTriggerForPoolsBasedOnSchedule;
  let mockLogger;

  beforeEach(async () => {
    await dbOperator.dropCollection('schedules');
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
    sinon.restore();
    mockLogger = {
      info: sinon.spy(),
      error: sinon.spy(),
    };
    kickOffAutoTriggerForPoolsBasedOnSchedule = makeKickOffAutoTriggerForPoolsBasedOnSchedule(
      getPoolById,
      getTestEnvironment,
      mockLogger,
      kickOffSpinnakerFlow,
    );
  });

  after(async () => {
    await dbOperator.dropCollection('schedules');
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });

  it('successfully kicks off auto trigger flow against test environments for pso', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({
      status: 'Available',
      pools: ['testPool'],
    });
    const fakeTestEnvironmentTwo = makeFakeTestEnvironment({
      status: 'Available',
      pools: ['testPool'],
    });
    const fakeTestEnvironmentThree = makeFakeTestEnvironment({
      status: 'Available',
      pools: ['testPool'],
    });
    await dbOperator.insert(fakeTestEnvironmentOne, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironmentTwo, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironmentThree, 'testEnvironments');

    const fakePool = makeFakePool({
      poolName: 'testPool',
      assignedTestEnvironmentIds: [
        fakeTestEnvironmentOne.id,
        fakeTestEnvironmentTwo.id,
        fakeTestEnvironmentThree.id,
      ],
    });
    await dbOperator.insert(fakePool, 'pools');
    const fakeSchedule = makeFakeSchedule({
      scheduleEnabled: true,
      typeOfItemsToSchedule: 'pool',
      refreshData: {
        itemsToScheduleIds: [fakePool.id],
        triggeredSpinnakerPipelineApplicationName: 'thunderbeetest',
        triggeredSpinnakerPipelineName: 'Fake_Test_Trigger_Flow_Fake',
      },
      retentionPolicyData: {
        retentionPolicyEnabled: false,
      },
      scheduleOptions: {
        scheduleType: 'auto-trigger',
        cronSchedule: '0 3 * * *',
        projectArea: 'pso',
      },
    });

    await dbOperator.insert(fakeSchedule, 'schedules');
    const autoTriggerKickedOff = await kickOffAutoTriggerForPoolsBasedOnSchedule(fakeSchedule);

    expect(autoTriggerKickedOff).toBeTruthy();
  });
  it('successfully kicks off auto trigger flow against single test environment for release', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({
      status: 'Available',
      pools: ['testPool'],
    });
    await dbOperator.insert(fakeTestEnvironmentOne, 'testEnvironments');

    const fakePool = makeFakePool({
      poolName: 'testPool',
      assignedTestEnvironmentIds: [fakeTestEnvironmentOne.id],
    });
    await dbOperator.insert(fakePool, 'pools');
    const fakeSchedule = makeFakeSchedule({
      scheduleEnabled: true,
      typeOfItemsToSchedule: 'pool',
      refreshData: {
        itemsToScheduleIds: [fakePool.id],
        triggeredSpinnakerPipelineApplicationName: 'thunderbeetest',
        triggeredSpinnakerPipelineName: 'Fake_Test_Trigger_Flow_Fake',
      },
      retentionPolicyData: {
        retentionPolicyEnabled: false,
        numOfStanbyEnvsToBeRetained: 1,
        numOfEiapReleaseForComparison: 1,
      },
      scheduleOptions: {
        scheduleType: 'auto-trigger',
        cronSchedule: '0 3 * * *',
        projectArea: 'release',
      },
    });

    await dbOperator.insert(fakeSchedule, 'schedules');
    const autoTriggerKickedOff = await kickOffAutoTriggerForPoolsBasedOnSchedule(fakeSchedule);

    expect(autoTriggerKickedOff).toBeTruthy();
  });
  it('successfully kicks off auto trigger flow against single test environment for prod-eng', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({
      status: 'Available',
      pools: ['testPool'],
    });
    await dbOperator.insert(fakeTestEnvironmentOne, 'testEnvironments');

    const fakePool = makeFakePool({
      poolName: 'testPool',
      assignedTestEnvironmentIds: [fakeTestEnvironmentOne.id],
    });
    await dbOperator.insert(fakePool, 'pools');

    const fakeSchedule = makeFakeSchedule({
      scheduleEnabled: true,
      typeOfItemsToSchedule: 'pool',
      refreshData: {
        itemsToScheduleIds: [fakePool.id],
        triggeredSpinnakerPipelineApplicationName: 'thunderbeetest',
        triggeredSpinnakerPipelineName: 'Fake_Test_Trigger_Flow_Fake',
      },
      retentionPolicyData: {
        retentionPolicyEnabled: false,
        numOfStanbyEnvsToBeRetained: 1,
        numOfEiapReleaseForComparison: 1,
      },
      scheduleOptions: {
        scheduleType: 'auto-trigger',
        cronSchedule: '0 3 * * *',
        projectArea: 'prod-eng',
      },
    });

    await dbOperator.insert(fakeSchedule, 'schedules');
    const autoTriggerKickedOff = await kickOffAutoTriggerForPoolsBasedOnSchedule(fakeSchedule);

    expect(autoTriggerKickedOff).toBeTruthy();
  });

  it('should not kick off auto trigger flow when no available environments', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({
      status: 'Standby',
      pools: ['testPool'],
    });
    await dbOperator.insert(fakeTestEnvironmentOne, 'testEnvironments');

    const fakePool = makeFakePool({
      poolName: 'testPool',
      assignedTestEnvironmentIds: [fakeTestEnvironmentOne.id],
    });
    await dbOperator.insert(fakePool, 'pools');

    const fakeSchedule = makeFakeSchedule({
      scheduleEnabled: true,
      typeOfItemsToSchedule: 'pool',
      refreshData: {
        itemsToScheduleIds: [fakePool.id],
        triggeredSpinnakerPipelineApplicationName: 'thunderbeetest',
        triggeredSpinnakerPipelineName: 'Fake_Test_Trigger_Flow_Fake',
      },
      retentionPolicyData: {
        retentionPolicyEnabled: false,
        numOfStanbyEnvsToBeRetained: 1,
        numOfEiapReleaseForComparison: 1,
      },
      scheduleOptions: {
        scheduleType: 'auto-trigger',
        cronSchedule: '0 3 * * *',
        projectArea: 'prod-eng',
      },
    });

    await dbOperator.insert(fakeSchedule, 'schedules');
    await kickOffAutoTriggerForPoolsBasedOnSchedule(fakeSchedule);
    const expected = {
      errorInfo: {
        message:
          'No test environments in available status. Spinnaker pipeline will not be triggered.',
      },
      loggingTags: {
        req: {},
        res: {},
        service: 'Schedules (controller)',
        action: 'kickOffScheduledPipelineFromPoolsBasedOnSchedule',
        actionParameters: {},
      },
    };
    sinon.assert.calledWith(mockLogger.error.lastCall, expected);
  });
});
