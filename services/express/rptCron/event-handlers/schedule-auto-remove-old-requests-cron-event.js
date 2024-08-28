const Cron = require('croner');

const { kickOffAutoRemoveOldRequests } = require('../controllers');

Cron('0 0 */12 * * *', async () => {
  await kickOffAutoRemoveOldRequests();
});
