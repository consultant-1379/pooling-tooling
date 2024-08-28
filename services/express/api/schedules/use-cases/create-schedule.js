const { BadRequestError } = require('../../../interfaces/BadRequestError');
const { ConflictError } = require('../../../interfaces/ConflictError');

function makeCreateSchedule(createSchedule, logger) {
  return function addSchedule(scheduleWithSameNameAsScheduleInfo, scheduleInfo) {
    const loggingTags = {
      service: 'Schedules (use-cases)',
      action: 'addSchedule',
      actionParameters: {},
    };

    if (!scheduleInfo) {
      const errorInfo = {
        message: 'Schedule information is empty',
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new BadRequestError(errorInfo.message);
    }

    if (scheduleWithSameNameAsScheduleInfo.length > 0) {
      const errorInfo = {
        message: `A schedule named ${scheduleInfo.scheduleName} already exists. Not creating new schedule with the same name.`,
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new ConflictError(errorInfo.message);
    }

    const createdSchedule = createSchedule(scheduleInfo);

    logger.info(loggingTags, `Schedule entity with name:${scheduleInfo.scheduleName} was successfully created.`);

    return {
      id: createdSchedule.getId(),
      scheduleName: createdSchedule.getScheduleName(),
      scheduleEnabled: createdSchedule.getScheduleEnabled(),
      typeOfItemsToSchedule: createdSchedule.getTypeOfItemsToSchedule(),
      refreshData: createdSchedule.getRefreshData(),
      retentionPolicyData: createdSchedule.getRetentionPolicyData(),
      scheduleOptions: createdSchedule.getScheduleOptions(),
      createdOn: new Date(createdSchedule.getCreatedOn()),
      modifiedOn: new Date(createdSchedule.getModifiedOn()),
    };
  };
}

module.exports = { makeCreateSchedule };
