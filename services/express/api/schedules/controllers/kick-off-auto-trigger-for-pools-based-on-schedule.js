const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeKickOffAutoTriggerForPoolsBasedOnSchedule(
  getPoolById,
  getTestEnvironmentById,
  logger,
  kickOffSpinnakerFlow,
) {
  return async function kickOffAutoTriggerForPoolsBasedOnSchedule(schedule) {
    const loggingTags = {
      req: {},
      res: {},
      service: 'Schedules (controller)',
      action: 'kickOffScheduledPipelineFromPoolsBasedOnSchedule',
      actionParameters: {},
    };
    for (const idOfItemToSchedule of schedule.refreshData.itemsToScheduleIds) {
      try {
        const [pool] = await getPoolById({
          params: { id: idOfItemToSchedule },
        });
        const testEnvironmentIds = [];
        for (const testEnvironmentId of pool.assignedTestEnvironmentIds) {
          const [testEnvironment] = await getTestEnvironmentById({
            params: { id: testEnvironmentId },
          });
          if (testEnvironment.status === 'Available') {
            testEnvironmentIds.push(testEnvironment.id);
            break;
          }
        }

        if (testEnvironmentIds.length === 0) {
          const errorInfo = {
            message:
              'No test environments in available status. Spinnaker pipeline will not be triggered.',
          };
          logger.error(
            { errorInfo, loggingTags },
            `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
          );
          throw new NotFoundError(errorInfo.message);
        }

        for (const testEnvironmentToBeRefreshedId of testEnvironmentIds) {
          const [testEnvironment] = await getTestEnvironmentById({
            params: { id: testEnvironmentToBeRefreshedId },
          });
          logger.info(
            loggingTags,
            `Kicking off ${schedule.refreshData.spinnakerPipelineName} \
pipeline with test environment ${testEnvironment.name}.`,
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

module.exports = { makeKickOffAutoTriggerForPoolsBasedOnSchedule };
