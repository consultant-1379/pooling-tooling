function makeBuildJenkinsJob(jenkinsClient, logger) {
  return function buildJenkinsJob(jobName, jobParams) {
    const loggingTags = {
      service: 'Jenkins (use-cases)',
      action: 'buildJenkinsJob',
      actionParameters: { JobName: jobName, JobParams: jobParams },
    };

    if (process.env.NODE_ENV === 'PROD' && process.env.TB_FUNCTIONAL_USER && process.env.TB_FUNCTIONAL_USER_PASSWORD) {
      jenkinsClient.job.build({
        name: jobName,
        parameters: jobParams,
      }, (err) => {
        if (err) {
          throw err;
        }
      });
      logger.info(loggingTags, `Build ${jobName} Jenkins job.`);
    } else {
      console.log('DEV: Building job: %s', jobName);
    }
  };
}

module.exports = { makeBuildJenkinsJob };
