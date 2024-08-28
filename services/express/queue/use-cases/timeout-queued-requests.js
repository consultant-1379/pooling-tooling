function makeTimeoutQueuedRequest(updateRequest) {
  return async function timeoutQueuedRequest(queuedRequest) {
    const createdOnTimeStamp = Date.parse(queuedRequest.createdOn);
    const currentTimeStamp = Date.parse(new Date(Date.now()));
    const queuedRequestTimeout = Object.prototype.hasOwnProperty.call(queuedRequest, 'requestTimeout') ? queuedRequest.requestTimeout : 7200000;
    if ((currentTimeStamp - createdOnTimeStamp) > queuedRequestTimeout) {
      const updatedRequest = await updateRequest(queuedRequest, { status: 'Timeout' });
      return updatedRequest;
    }
    return null;
  };
}

module.exports = { makeTimeoutQueuedRequest };
