const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeGetSchedulesBasedOnType(scheduleDb, logger) {
  return async function getSchedulesBasedOnType(httpRequest) {
    const { typeOfItemsToSchedule } = httpRequest.params;
    const retrievedSchedules = await scheduleDb.findBySearchQuery({
      'scheduleOptions.scheduleType': typeOfItemsToSchedule,
    }, 'schedules');

    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Schedules (controller)',
      action: 'getSchedulesBasedOnType',
      actionParameters: { TypeOfItemsToSchedule: typeOfItemsToSchedule },
    };
    try {
      if (!retrievedSchedules || retrievedSchedules.length === 0) {
        const errorInfo = {
          message: `No schedules with type ${typeOfItemsToSchedule} found.`,
        };
        throw new NotFoundError(errorInfo.message);
      }

      const idList = retrievedSchedules.map((schedule) => schedule.id);

      loggingTags.res = logger.logFormatter([retrievedSchedules]);
      loggingTags.actionParameters = { TypeOfItemsToSchedule: typeOfItemsToSchedule };

      logger.info(loggingTags, `GET request to retrieve Schedule object with type :${typeOfItemsToSchedule}. \
  ${retrievedSchedules.length} schedule(s) retrieved. IDs: ${idList}`);
      return retrievedSchedules;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };
      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
    }
  };
}

module.exports = { makeGetSchedulesBasedOnType };
