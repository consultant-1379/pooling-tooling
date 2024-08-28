function makeCancelRequest(logger, dbOperator, updateRequest) {
  return async function cancelRequest(queuedRequest) {
    const { id } = queuedRequest;
    const loggingTags = {
      service: 'Queue (use-case)',
      action: 'cancelRequest',
      actionParameters: { queuedRequest: id },
    };
    logger.info(loggingTags, `Request with ID: ${id} was canceled`);
    const updatedRequest = updateRequest(queuedRequest, {
      status: 'Aborted',
    });
    await dbOperator.findOneAndUpdate('requests', { _id: id }, updatedRequest);
    logger.info(
      loggingTags,
      `Request with ID: ${id} is set to status: 'Aborted'`,
    );
  };
}

module.exports = { makeCancelRequest };
