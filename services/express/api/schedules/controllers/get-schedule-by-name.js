const { ConflictError } = require('../../../interfaces/ConflictError');

function makeGetScheduleByName(scheduleDb, logger) {
  return async function getScheduleByName(httpRequest) {
    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Schedules (controller)',
      action: 'getScheduleByName',
      actionParameters: {},
    };

    try {
      const scheduleName = httpRequest.params.name;
      const retrievedSchedules = await scheduleDb.findBySearchQuery({
        scheduleName,
      }, 'schedules');

      loggingTags.res = logger.logFormatter([retrievedSchedules]);
      loggingTags.actionParameters = { ScheduleName: scheduleName };

      if (retrievedSchedules.length > 1) {
        const errorInfo = {
          message: `More than one Schedule found with name ${scheduleName}.`,
        };
        logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
        throw new ConflictError(errorInfo.message);
      }
      logger.info(loggingTags, `GET request to retrieve Schedule object with name:${scheduleName}.`);
      return retrievedSchedules;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };

      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}: ${error.message}`,
      );

      throw error;
    }
  };
}

module.exports = { makeGetScheduleByName };
