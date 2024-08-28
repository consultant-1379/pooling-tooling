function makeGetSingleBuildForBuildMaster(request, url, functionalUserIsAvailableOrTesting, logger) {
  return async function getSingleBuildForBuildMaster(buildMaster, buildNumber, jobName) {
    if (functionalUserIsAvailableOrTesting()) {
      const loggingTags = {
        service: 'Spinnaker (use-cases)',
        action: 'getSingleBuildForBuildMaster',
        actionParameters: {
          BuildMaster: buildMaster,
          BuildNumber: buildNumber,
          JobName: jobName,
        },
      };
      let singleBuildFromBuildMaster = {};
      try {
        await request
          .get(`${url}/v3/builds/${buildMaster}/build/${buildNumber}?job=${jobName}`)
          .auth(process.env.TB_FUNCTIONAL_USER, process.env.TB_FUNCTIONAL_USER_PASSWORD)
          .then((singleBuildFromBuildMasterData) => {
            singleBuildFromBuildMaster = JSON.parse(
              singleBuildFromBuildMasterData.text,
            );
          });
        logger.info(loggingTags, `GET request to retrieve execution build number ${buildNumber} for ${jobName}.`);
        return singleBuildFromBuildMaster;
      } catch (err) {
        const errorInfo = {
          error: err,
          message: 'Unable to GET a single build from build master.',
        };
        logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
        throw new Error(errorInfo.message);
      }
    }
    console.log('DEV: Jenkins Build Master: %s', buildMaster);
  };
}

module.exports = { makeGetSingleBuildForBuildMaster };
