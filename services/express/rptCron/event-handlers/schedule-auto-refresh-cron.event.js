const Cron = require('croner');

const { kickOffAutoRefreshSchedules } = require('../controllers');

Cron('*/1 * * * *', async () => {
  await kickOffAutoRefreshSchedules();
});
