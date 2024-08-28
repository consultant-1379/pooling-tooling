/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

require('../server');

function runTestFile(testName, path) {
  describe(`it should run ${testName} contract tests`, () => {
    require(path);
  });
}

describe('Contract Tests', () => {
  it('should run all contract tests specified below', () => {
    runTestFile('test-environments', './test-environments/test-environments-contract.spec.js');
    runTestFile('pools', './pools/pools-contract.spec.js');
    runTestFile('requests', './requests/requests-contract.spec.js');
    runTestFile('requests', './requests/requests-zod-error-contract.spec.js');
    runTestFile('pipeline-functions', './pipeline-functions/pipeline-functions-contract.spec.js');
  });
});
