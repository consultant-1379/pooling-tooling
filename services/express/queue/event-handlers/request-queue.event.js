const cron = require('node-cron');
const logger = require('../../logger/logger');
const { timeoutRequests } = require('../controllers');
const { resolveRequests } = require('../controllers');

cron.schedule('*/20 * * * * *', async () => {
  const queryInfo = 'Requests Queue Service';
  const loggingTags = {
    service: 'Queue (event-handler)',
    action: 'queueCron',
    actionParameters: { query: queryInfo },
  };
  try {
    await timeoutRequests();
    await resolveRequests();
  } catch (err) {
    const errorInfo = {
      error: err,
      message: 'Issue with timeout/resolve request functions.',
    };
    logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
    throw new Error(errorInfo.message);
  }
});
