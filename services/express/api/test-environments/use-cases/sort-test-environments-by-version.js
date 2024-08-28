const { BadRequestError } = require('../../../interfaces/BadRequestError');

function makeSortTestEnvironmentsByVersion(compare, validate) {
  return function sortTestEnvironmentsByVersion(testEnvironments) {
    if (!testEnvironments || testEnvironments.length === 0) {
      throw new BadRequestError('No test environments passed, unable to sort by version');
    }
    return testEnvironments.sort(
      (env1, env2) => {
        if (!validate(env1.properties.version) || !validate(env2.properties.version)) {
          throw new BadRequestError('One or more of the passed environments version has invalid semver syntax');
        }
        return compare(env1.properties.version, env2.properties.version, '<=') ? 1 : -1;
      },
    );
  };
}

module.exports = { makeSortTestEnvironmentsByVersion };
