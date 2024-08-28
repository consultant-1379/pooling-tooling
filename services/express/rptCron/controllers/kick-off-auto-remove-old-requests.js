function makeKickOffAutoRemoveOldRequests(logger, dbOperator) {
  return async function kickOffAutoRemoveOldRequests() {
    const loggingTags = {
      service: 'RPT CRON (controller)',
      action: 'kickOffAutoRemoveOldRequests',
      actionParameters: {},
    };
    const currentDate = new Date();
    const numberOfDays = 60;
    const desiredDate = new Date();
    desiredDate.setDate(currentDate.getDate() - numberOfDays);

    const requestsOlderThanDesiredDateAggregation = [
      { $match: { modifiedOn: { $lte: desiredDate } } },
    ];

    const requestsOlderThanDesiredDate = await dbOperator.findByAggregation(requestsOlderThanDesiredDateAggregation, 'requests');
    let numberOfDeletedRequests = 0;
    const testEnvironmentIdsToClean = [];
    for (const requestOlderThanDesiredDate of requestsOlderThanDesiredDate) {
      const correspondingTestEnvironments = await dbOperator.findById(requestOlderThanDesiredDate.testEnvironmentId, 'testEnvironments');
      if (correspondingTestEnvironments.length === 0) {
        await dbOperator.remove({ id: requestOlderThanDesiredDate.id }, 'requests');
        numberOfDeletedRequests += 1;
      } else {
        testEnvironmentIdsToClean.push(correspondingTestEnvironments[0].id);
      }
    }

    for (const testEnvironmentIdToClean of testEnvironmentIdsToClean) {
      const sortedCorrespondingRequestsAggregation = [
        { $match: { testEnvironmentId: testEnvironmentIdToClean } },
        { $sort: { modifiedOn: 1 } },
      ];
      const sortedCorrespondingRequests = await dbOperator.findByAggregation(sortedCorrespondingRequestsAggregation, 'requests');
      for (let requestsIndex = sortedCorrespondingRequests.length - 2; requestsIndex >= 0; requestsIndex -= 1) {
        await dbOperator.remove({ id: sortedCorrespondingRequests[requestsIndex].id }, 'requests');
        numberOfDeletedRequests += 1;
      }
    }

    logger.info(loggingTags, `Detected ${requestsOlderThanDesiredDate.length} old requests, and removed ${numberOfDeletedRequests} old requests`);
    return true;
  };
}

module.exports = { makeKickOffAutoRemoveOldRequests };
