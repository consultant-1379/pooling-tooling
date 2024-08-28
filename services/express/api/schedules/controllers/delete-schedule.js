function makeDeleteSchedule(schedulesDb, logger) {
  return async function deleteSchedule(httpRequest) {
    await schedulesDb.remove({ id: httpRequest.params.id }, 'schedules');
    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Schedules (controller)',
      action: 'deleteSchedule',
      actionParameters: { ScheduleId: httpRequest.params.id },
    };
    logger.info(loggingTags, `DEL request to remove Schedule object with ID:${httpRequest.params.id}.`);
  };
}

module.exports = { makeDeleteSchedule };
