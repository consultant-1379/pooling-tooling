const expect = require('expect');

const { updatePoolViewIndices } = require('../../use-cases/index');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Update pool view indices for delete use case', () => {
  it('throws an error if there are no environments', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const expectedErrorMessage = `Can't find environments in pool: pool when reordering indices \
for removal of test environment ${fakeTestEnvironment.id}`;
    try {
      updatePoolViewIndices(false, 'pool', fakeTestEnvironment);
    } catch (error) {
      expect(error.message).toBe(expectedErrorMessage);
    }
  });
});
