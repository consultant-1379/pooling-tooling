const Cron = require('croner');

const { kickOffAutoTriggerSchedules } = require('../controllers');

Cron('*/1 * * * *', async () => {
  await kickOffAutoTriggerSchedules();
});
