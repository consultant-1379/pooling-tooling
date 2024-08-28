function makeGetSchedules(schedulesDb, logger) {
  return async function getSchedules() {
    const schedulesRetrieved = await schedulesDb.findAll('schedules');
    const loggingTags = {
      req: {},
      res: {},
      service: 'Schedules (controller)',
      action: 'getSchedules',
      actionParameters: {},
    };
    logger.info(loggingTags, `GET request to retrieve all the Schedule objects. ${schedulesRetrieved.length} schedule(s) retrieved`);
    return schedulesRetrieved;
  };
}

module.exports = { makeGetSchedules };
