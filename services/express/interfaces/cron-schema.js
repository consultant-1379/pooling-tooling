function buildCronSchema(z, nodeCron) {
  return z
    .string()
    .min(1)
    .refine((val) => nodeCron.validate(val), {
      message: 'The cronSchedule parameter passed into scheduleOptions must be in a valid crontab format.',
    });
}

module.exports = { buildCronSchema };
