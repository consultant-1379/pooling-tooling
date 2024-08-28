const expect = require('expect');
const { compare } = require('compare-versions');
const semverValid = require('semver/functions/valid');

const { makeDetermineTestEnvironmentsToBeRefreshed } = require('../../use-cases/determine-test-environments-to-be-refreshed');
const { makeKickOffAutoRefreshForPoolsBasedOnSchedule } = require('../../controllers/kick-off-auto-refresh-for-pools-based-on-schedule');

const { getPoolById } = require('../../../pools/controllers');
const { getTestEnvironment } = require('../../../test-environments/controllers');
const { kickOffSpinnakerFlow } = require('../../use-cases');
const { sortElements } = require('../../../../utilities');
const { getSortedEiapVersions } = require('../../../../rptCron/use-cases');

const logger = require('../../../../logger/logger');
const { dbOperator } = require('../../../../data-access');

const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Integration Test: (Schedule service) Kick off auto refresh for pool based on schedule controller', () => {
  let determineTestEnvironmentsToBeRefreshed;
  let kickOffAutoRefreshForPoolsBasedOnSchedule;

  beforeEach(async () => {
    await dbOperator.dropCollection('schedules');
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');

    determineTestEnvironmentsToBeRefreshed = makeDetermineTestEnvironmentsToBeRefreshed(getTestEnvironment,
      semverValid, compare, sortElements, getSortedEiapVersions, logger);
    kickOffAutoRefreshForPoolsBasedOnSchedule = makeKickOffAutoRefreshForPoolsBasedOnSchedule(getPoolById,
      determineTestEnvironmentsToBeRefreshed, getTestEnvironment, logger, kickOffSpinnakerFlow, getSortedEiapVersions);
  });

  it('successfully kicks off auto refresh flow against test environments for pso', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({
      status: 'Standby',
      pools: ['testPool'],
      properties: { version: '2.0.0-1349' },
    });
    const fakeTestEnvironmentTwo = makeFakeTestEnvironment({
      status: 'Standby',
      pools: ['testPool'],
      properties: { version: '2.0.0-1348' },
    });
    const fakeTestEnvironmentThree = makeFakeTestEnvironment({
      status: 'Standby',
      pools: ['testPool'],
      properties: { version: '2.0.0-1347' },
    });
    await dbOperator.insert(fakeTestEnvironmentOne, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironmentTwo, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironmentThree, 'testEnvironments');

    const fakePool = makeFakePool({
      poolName: 'testPool',
      assignedTestEnvironmentIds: [fakeTestEnvironmentOne.id, fakeTestEnvironmentTwo.id, fakeTestEnvironmentThree.id],
    });
    await dbOperator.insert(fakePool, 'pools');
    const fakeSchedule = makeFakeSchedule({
      scheduleEnabled: true,
      typeOfItemsToSchedule: 'pool',
      refreshData: {
        itemsToScheduleIds: [fakePool.id],
        refreshedSpinnakerPipelineApplicationName: 'thunderbeetest',
        refreshedSpinnakerPipelineName: 'Fake_Test_Refresh_Flow_Fake',
      },
      retentionPolicyData: {
        retentionPolicyEnabled: false,
      },
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'pso',
      },
    });

    await dbOperator.insert(fakeSchedule, 'schedules');
    const autoRefreshKickedOff = await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);

    expect(autoRefreshKickedOff).toBeTruthy();
  });
  it('successfully kicks off auto refresh flow against single test environment for release', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({
      status: 'Standby',
      pools: ['testPool'],
      properties: { version: '2.0.0-1349' },
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
        refreshedSpinnakerPipelineApplicationName: 'thunderbeetest',
        refreshedSpinnakerPipelineName: 'Fake_Test_Refresh_Flow_Fake',
      },
      retentionPolicyData: {
        retentionPolicyEnabled: false,
        numOfStanbyEnvsToBeRetained: 1,
        numOfEiapReleaseForComparison: 1,
      },
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'release',
      },
    });

    await dbOperator.insert(fakeSchedule, 'schedules');
    const autoRefreshKickedOff = await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);

    expect(autoRefreshKickedOff).toBeTruthy();
  });
  it('successfully kicks off auto refresh flow against single test environment for prod-eng', async () => {
    const fakeTestEnvironmentOne = makeFakeTestEnvironment({
      status: 'Standby',
      pools: ['testPool'],
      properties: { version: '2.0.0-1349' },
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
        refreshedSpinnakerPipelineApplicationName: 'thunderbeetest',
        refreshedSpinnakerPipelineName: 'Fake_Test_Refresh_Flow_Fake',
      },
      retentionPolicyData: {
        retentionPolicyEnabled: false,
        numOfStanbyEnvsToBeRetained: 1,
        numOfEiapReleaseForComparison: 1,
      },
      scheduleOptions: {
        scheduleType: 'auto-refresh',
        cronSchedule: '0 3 * * *',
        projectArea: 'prod-eng',
      },
    });

    await dbOperator.insert(fakeSchedule, 'schedules');
    const autoRefreshKickedOff = await kickOffAutoRefreshForPoolsBasedOnSchedule(fakeSchedule);

    expect(autoRefreshKickedOff).toBeTruthy();
  });

  after(async () => {
    await dbOperator.dropCollection('schedules');
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
});
