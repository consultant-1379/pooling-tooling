function makeDetermineTestEnvironmentsToBeRefreshed(getTestEnvironmentById, semverValid, compare, sortElements, getSortedEiapVersions, logger) {
  return async function determineTestEnvironmentsToBeRefreshed(assignedTestEnvironmentIds, numOfStanbyEnvsToBeRetained,
    numOfEiapReleasesForComparison) {
    const loggingTags = {
      service: 'Schedules (use-cases)',
      action: 'determineTestEnvironmentsToBeRefreshed',
      actionParameters: {
        AssignedTestEnvironmentIds: assignedTestEnvironmentIds,
        NumOfStandbyEnvsToBeRetained: numOfStanbyEnvsToBeRetained,
        NumOfEiapReleasesForComparison: numOfEiapReleasesForComparison,
      },
    };
    try {
      if (!assignedTestEnvironmentIds || assignedTestEnvironmentIds.length === 0) {
        const errorInfo = {
          message: 'No test environments passed, unable to determine test environments to refresh',
        };
        throw new Error(errorInfo.message);
      }

      const testEnvironmentsToBeSortedByVersion = [];
      const testEnvironmentsToBeRefreshedNames = [];
      const testEnvironmentsToBeRefreshedIds = [];

      for (const testEnvironmentId of assignedTestEnvironmentIds) {
        const [testEnvironment] = await getTestEnvironmentById({ params: { id: testEnvironmentId } });
        if (testEnvironment.status === 'Standby') {
          if (semverValid(testEnvironment.properties.version) === testEnvironment.properties.version) {
            testEnvironmentsToBeSortedByVersion.push(testEnvironment);
          } else {
            const errorInfo = {
              message: `Test environment (${testEnvironment.name}) version property is not a valid semver and will not be considered for refresh`,
            };
            logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service.`);
          }
        }
      }

      const comparator = function compareFunction(testEnvironment1, testEnvironment2) {
        return compare(testEnvironment1.properties.version, testEnvironment2.properties.version, '<=') ? 1 : -1;
      };

      const sortedTestEnvironments = sortElements(comparator, testEnvironmentsToBeSortedByVersion);

      const testEnvironmentsToCompareWithLatest = sortedTestEnvironments.slice(numOfStanbyEnvsToBeRetained);

      logger.info(loggingTags, `${testEnvironmentsToCompareWithLatest.length} test environment(s) remain \
  after ${numOfStanbyEnvsToBeRetained} retained.`);

      const sortedEiapVersions = await getSortedEiapVersions();
      const latestEicVersions = sortedEiapVersions.slice(0, numOfEiapReleasesForComparison);

      for (const testEnvironment of testEnvironmentsToCompareWithLatest) {
        const testEnvironmentVersion = testEnvironment.properties.version;
        if (!latestEicVersions.includes(testEnvironmentVersion)) {
          testEnvironmentsToBeRefreshedNames.push(testEnvironment.name);
          testEnvironmentsToBeRefreshedIds.push(testEnvironment.id);
        }
      }

      if (testEnvironmentsToBeRefreshedIds.length === 0) {
        const errorInfo = {
          message: 'No test environments were found that require refreshing',
        };
        throw new Error(errorInfo.message);
      }

      logger.info(loggingTags, `${testEnvironmentsToBeRefreshedIds.length} test environment(s) found that require refreshing \
with names: ${testEnvironmentsToBeRefreshedNames}`);
      return testEnvironmentsToBeRefreshedIds;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };
      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
    }
  };
}

module.exports = { makeDetermineTestEnvironmentsToBeRefreshed };
