const { BadRequestError } = require('../../../interfaces/BadRequestError');

function buildMakeRequest(IdGenerator) {
  return function makeRequest({
    id = IdGenerator.makeId(),
    testEnvironmentId = '',
    poolName,
    requestorDetails,
    status,
    requestTimeout = 7200000,
    createdOn = new Date(Date.now()),
    modifiedOn = new Date(Date.now()),
    lastReservedAt = new Date(Date.now()),
  } = {}) {
    const requiredProperties = [poolName, requestorDetails, status];
    const validStatusOptions = ['Reserved', 'Unreserved', 'Pending', 'Queued', 'Timeout', 'Aborted'];

    if (!IdGenerator.isValidId(id)) {
      throw new BadRequestError('Request entity must have a valid id.');
    }

    if (!requiredProperties.every((element) => element)) {
      throw new BadRequestError('When making a request, not every required property was provided.');
    }
    if (!validStatusOptions.includes(status)) {
      throw new BadRequestError(`Invalid status '${status}' provided when making request`);
    }
    if (typeof requestorDetails !== 'object' || requestorDetails === null
        || !Object.prototype.hasOwnProperty.call(requestorDetails, 'name')
        || !Object.prototype.hasOwnProperty.call(requestorDetails, 'area')) {
      throw new BadRequestError('Invalid Requestor Details provided when making request');
    }

    if (status === 'Queued' && testEnvironmentId) {
      throw new BadRequestError('When creating a queued request, you must not specify an Environment ID.');
    }

    if (requestTimeout < 60000) {
      throw new BadRequestError('The timeout can not be less than a minute.');
    }

    return Object.freeze({
      getId: () => id,
      getTestEnvironmentId: () => testEnvironmentId,
      getPoolName: () => poolName,
      getRequestorDetails: () => requestorDetails,
      getStatus: () => status,
      getRequestTimeout: () => requestTimeout,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
      getLastReservedAt: () => lastReservedAt,
    });
  };
}

module.exports = { buildMakeRequest };
