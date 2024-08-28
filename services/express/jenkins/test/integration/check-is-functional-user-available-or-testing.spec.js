const expect = require('expect');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

describe('Integration Test: (Jenkins service) Check is the functional user available or testing', () => {
  it('should ensure true is returned when the function is called for testing purposes', () => {
    const functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    const isFunctionalUserTesting = functionalUserIsAvailableOrTesting();
    expect(isFunctionalUserTesting).toBeTruthy();
  });

  it('should ensure the password is returned when the function is not called for testing purposes', () => {
    const { TB_FUNCTIONAL_USER } = process.env;
    const { TB_FUNCTIONAL_USER_PASSWORD } = process.env;

    process.env.TB_FUNCTIONAL_USER = 'dummy_user';
    process.env.TB_FUNCTIONAL_USER_PASSWORD = 'dummy_pass';

    const functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    const isFunctionalUserTesting = functionalUserIsAvailableOrTesting();
    expect(isFunctionalUserTesting).toBe(process.env.TB_FUNCTIONAL_USER_PASSWORD);

    process.env.TB_FUNCTIONAL_USER = TB_FUNCTIONAL_USER;
    process.env.TB_FUNCTIONAL_USER_PASSWORD = TB_FUNCTIONAL_USER_PASSWORD;
  });
});
