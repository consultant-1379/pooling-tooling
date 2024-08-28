function makeGetAllBuildsForBuildMaster(request, url, functionalUserIsAvailableOrTesting, logger) {
  return async function getAllBuildsForBuildMaster(buildMaster, jobName) {
    if (functionalUserIsAvailableOrTesting()) {
      const loggingTags = {
        service: 'Spinnaker (use-cases)',
        action: 'getAllBuildsForBuildMaster',
        actionParameters: {
          BuildMaster: buildMaster,
          JobName: jobName,
        },
      };
      let allBuildsFromBuildMaster = {};
      try {
        await request
          .get(`${url}/v3/builds/${buildMaster}/builds?job=${jobName}`)
          .auth(process.env.TB_FUNCTIONAL_USER, process.env.TB_FUNCTIONAL_USER_PASSWORD)
          .then((allBuildsFromBuildMasterData) => {
            allBuildsFromBuildMaster = JSON.parse(
              allBuildsFromBuildMasterData.text,
            );
          });
        logger.info(loggingTags, `GET request to retrieve all builds for ${jobName}.`);
        return allBuildsFromBuildMaster;
      } catch (err) {
        const errorInfo = {
          error: err,
          message: 'Unable to GET all builds for build master.',
        };
        logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
        throw new Error(errorInfo.message);
      }
    }
    console.log('DEV: Jenkins Build Master: %s', buildMaster);
  };
}

module.exports = { makeGetAllBuildsForBuildMaster };
