const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeKickOffAutoRefreshForPoolsBasedOnSchedule(
  getPoolById,
  determineTestEnvironmentsToBeRefreshed,
  getTestEnvironmentById,
  logger,
  kickOffSpinnakerFlow,
  getSortedEiapVersions,
) {
  return async function kickOffAutoRefreshForPoolsBasedOnSchedule(schedule) {
    const loggingTags = {
      req: {},
      res: {},
      service: 'Schedules (controller)',
      action: 'kickOffAutoRefreshForPoolsBasedOnSchedule',
      actionParameters: {},
    };
    for (const idOfItemToSchedule of schedule.refreshData.itemsToScheduleIds) {
      try {
        const [pool] = await getPoolById({
          params: { id: idOfItemToSchedule },
        });
        let testEnvironmentsToBeRefreshedIds = [];
        if (schedule.retentionPolicyData.retentionPolicyEnabled) {
          const { numOfStanbyEnvsToBeRetained } = schedule.retentionPolicyData;
          const numOfEiapReleasesForComparison = schedule.retentionPolicyData.numOfEiapReleaseForComparison;
          testEnvironmentsToBeRefreshedIds = await determineTestEnvironmentsToBeRefreshed(
            pool.assignedTestEnvironmentIds,
            numOfStanbyEnvsToBeRetained,
            numOfEiapReleasesForComparison,
          );
        } else {
          for (const testEnvironmentId of pool.assignedTestEnvironmentIds) {
            const [testEnvironment] = await getTestEnvironmentById({
              params: { id: testEnvironmentId },
            });
            const testEnvironmentVersion = testEnvironment.properties.version;
            const [latestEiapVersion] = await getSortedEiapVersions();
            if (
              testEnvironment.status === 'Standby'
              && testEnvironmentVersion !== latestEiapVersion
            ) {
              testEnvironmentsToBeRefreshedIds.push(testEnvironment.id);
            }
          }
        }

        if (testEnvironmentsToBeRefreshedIds.length === 0) {
          const errorInfo = {
            message:
              'No test environments identified that require refreshing. Refresh pipeline will not be triggered.',
          };
          logger.error(
            { errorInfo, loggingTags },
            `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
          );
          throw new NotFoundError(errorInfo.message);
        }

        for (const testEnvironmentToBeRefreshedId of testEnvironmentsToBeRefreshedIds) {
          const [testEnvironment] = await getTestEnvironmentById({
            params: { id: testEnvironmentToBeRefreshedId },
          });
          logger.info(
            loggingTags,
            `Pool refresh. Refreshing test environment with name: ${testEnvironment.name}.`,
          );
          await kickOffSpinnakerFlow(
            testEnvironment,
            schedule.refreshData.spinnakerPipelineApplicationName,
            schedule.refreshData.spinnakerPipelineName,
          );
        }
      } catch (error) {
        const errorInfo = {
          message: error.message,
        };
        logger.error(
          { errorInfo, loggingTags },
          `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
        );
      }
    }
    return true;
  };
}

module.exports = { makeKickOffAutoRefreshForPoolsBasedOnSchedule };
