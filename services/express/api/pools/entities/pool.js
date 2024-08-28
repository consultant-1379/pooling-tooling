const { BadRequestError } = require('../../../interfaces/BadRequestError');

function buildMakePool(IdGenerator) {
  return function makePool({
    id = IdGenerator.makeId(),
    assignedTestEnvironmentIds = [],
    poolName,
    creatorDetails,
    additionalInfo = '',
    createdOn = new Date(Date.now()),
    modifiedOn = new Date(Date.now()),

  } = {}) {
    const requiredProperties = [poolName, creatorDetails];

    if (!IdGenerator.isValidId(id)) {
      throw new BadRequestError('Pool entity must have a valid id.');
    }
    if (!requiredProperties.every((element) => element)) {
      throw new BadRequestError('When making a pool, not every required property was provided.');
    }
    if (!Array.isArray(assignedTestEnvironmentIds)) {
      throw new BadRequestError('Pool entity must use array for assignedTestEnvironmentIds.');
    }
    if (typeof creatorDetails !== 'object'
        || !Object.prototype.hasOwnProperty.call(creatorDetails, 'name')
        || !Object.prototype.hasOwnProperty.call(creatorDetails, 'area')) {
      throw new BadRequestError('Invalid Creator Details provided when making pool');
    }

    return Object.freeze({
      getId: () => id,
      getAssignedTestEnvironmentIds: () => assignedTestEnvironmentIds,
      getPoolName: () => poolName,
      getCreatorDetails: () => creatorDetails,
      getAdditionalInfo: () => additionalInfo,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
    });
  };
}

module.exports = { buildMakePool };
