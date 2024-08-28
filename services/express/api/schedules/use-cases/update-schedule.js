const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeUpdateSchedule(logger, flattenObject) {
  function updateScheduleEntity(changes) {
    if (changes.createdOn) {
      delete changes.createdOn;
    }
    if (changes.id) {
      delete changes.id;
    }
    if (changes.refreshData) {
      const flattenedRefreshData = flattenObject(
        changes.refreshData,
        'refreshData',
      );
      delete changes.refreshData;
      changes = { ...changes, ...flattenedRefreshData };
    }
    if (changes.retentionPolicyData) {
      const flattenedRetentionPolicyData = flattenObject(
        changes.retentionPolicyData,
        'retentionPolicyData',
      );
      delete changes.retentionPolicyData;
      changes = { ...changes, ...flattenedRetentionPolicyData };
    }
    if (changes.scheduleOptions) {
      const flattenedScheduleOptions = flattenObject(
        changes.scheduleOptions,
        'scheduleOptions',
      );
      delete changes.scheduleOptions;
      changes = { ...changes, ...flattenedScheduleOptions };
    }
    changes.modifiedOn = new Date();

    return { $set: changes };
  }
  return function updateSchedule([existingSchedule], changes) {
    const loggingTags = {
      service: 'Schedules (use-cases)',
      action: 'updateSchedules',
      actionParameters: { SchedulesChanges: changes },
    };
    try {
      if (!existingSchedule) {
        throw new NotFoundError('Schedule not found');
      }
      const updatedSchedule = updateScheduleEntity({ ...changes });
      logger.info(loggingTags, `Schedule object with name:${existingSchedule.scheduleName} is successfully updated.`);
      return updatedSchedule;
    } catch (error) {
      logger.error(
        { errorInfo: { message: `${error.message}` }, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
      throw error;
    }
  };
}

module.exports = { makeUpdateSchedule };
