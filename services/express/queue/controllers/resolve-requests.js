function makeResolveRequests(
  logger,
  dbOperator,
  queuedSearchQuery,
  checkIsExecutionCanceled,
  cancelRequest,
  reserveRequest,
) {
  return async function resolveRequests() {
    const loggingTags = {
      service: 'Queue (controller)',
      action: 'resolveRequests',
    };

    const queuedRequests = await dbOperator.findBySearchQuery(queuedSearchQuery, 'requests');
    if (!queuedRequests || queuedRequests.length === 0) { return; }
    logger.info(loggingTags, `Resolve requests called with the following queued requests: ${queuedRequests.map((request) => request.id).join(', ')}`);
    for (const queuedRequest of queuedRequests) {
      try {
        if (await checkIsExecutionCanceled(queuedRequest.requestorDetails.executionId)) {
          cancelRequest(queuedRequest);
          // eslint-disable-next-line no-continue
          continue;
        }
      } catch (err) {
        loggingTags.actionParameters = { queuedRequestId: queuedRequest.id };
        const errorInfo = {
          error: err,
          message: `Unable to determine if request with ID: ${queuedRequest.id} was canceled, skipping request in queue.`,
        };
        logger.error({ errorInfo, ...loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
        // eslint-disable-next-line no-continue
        continue;
      }
      await reserveRequest(queuedRequest);
    }
  };
}

module.exports = { makeResolveRequests };
