const expect = require('expect');

const { updateEnvironmentsViewIndices } = require('../../use-cases/index');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Update environments view indices for delete use case', () => {
  it('throws an error if there are no environments', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const expectedErrorMessage = `Can't find test environments when trying to reorder indices \
for removal of test environment ${fakeTestEnvironment.id}`;
    try {
      updateEnvironmentsViewIndices(false, fakeTestEnvironment);
    } catch (error) {
      expect(error.message).toBe(expectedErrorMessage);
    }
  });
});
