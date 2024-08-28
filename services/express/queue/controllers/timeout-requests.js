function makeTimeoutRequests(dbOperator, timeoutQueuedRequest, logger, queuedSearchQuery) {
  return async function timeoutRequests() {
    const queuedRequests = await dbOperator.findBySearchQuery(queuedSearchQuery, 'requests');
    if (!queuedRequests) return;
    queuedRequests.forEach(async (queuedRequest) => {
      const timedOutRequest = await timeoutQueuedRequest(queuedRequest);
      if (timedOutRequest) {
        await dbOperator.findOneAndUpdate(
          'requests',
          { _id: queuedRequest.id },
          timedOutRequest,
        );
        const loggingTags = {
          service: 'Queue (controller)',
          action: 'timeoutRequests',
          actionParameters: { timedOutRequestId: timedOutRequest.id },
        };
        logger.info(loggingTags, `Request with ID: ${timedOutRequest.id} is set to status: 'Timeout'`);
      }
    });
  };
}

module.exports = { makeTimeoutRequests };
