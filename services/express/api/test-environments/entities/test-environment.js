const { BadRequestError } = require('../../../interfaces/BadRequestError');

function buildMakeTestEnvironment(IdGenerator) {
  return function makeTestEnvironment({
    id = IdGenerator.makeId(),
    name,
    status = 'Available',
    requestId = '',
    pools,
    properties,
    stage = '',
    additionalInfo = '',
    comments = '',
    priorityInfo = {
      viewIndices: {},
    },
    createdOn = new Date(Date.now()),
    modifiedOn = new Date(Date.now()),
  } = {}) {
    const requireTestEnvironmentParameters = [name, status, pools, properties];
    const validStatusOptions = ['Available', 'Reserved', 'Quarantine', 'Standby', 'Refreshing'];

    if (!IdGenerator.isValidId(id)) {
      throw new BadRequestError('Test Environment entity must have a valid id.');
    }
    if (!requireTestEnvironmentParameters.every((element) => element)) {
      throw new BadRequestError('When making a test environment, not every required parameter was provided.');
    }
    if (!validStatusOptions.includes(status)) {
      throw new BadRequestError(`Invalid status '${status}' provided when making test environment`);
    }

    if (pools.length === 0) {
      throw new BadRequestError('No pools were provided when making test environment');
    }

    if (typeof properties !== 'object' || properties === null
        || !Object.prototype.hasOwnProperty.call(properties, 'product')
        || !Object.prototype.hasOwnProperty.call(properties, 'platformType')
        || !Object.prototype.hasOwnProperty.call(properties, 'version')
        || !Object.prototype.hasOwnProperty.call(properties, 'ccdVersion')) {
      throw new BadRequestError('Invalid test environment properties provided when making request');
    }

    return Object.freeze({
      getId: () => id,
      getName: () => name,
      getStatus: () => status,
      getRequestId: () => requestId,
      getPools: () => pools,
      getProperties: () => properties,
      getStage: () => stage,
      getAdditionalInfo: () => additionalInfo,
      getComments: () => comments,
      getPriorityInfo: () => priorityInfo,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
    });
  };
}

module.exports = { buildMakeTestEnvironment };
