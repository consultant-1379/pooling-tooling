const {
  Then
} = require("cypress-cucumber-preprocessor/steps");

const {
  addPool,
  addTestEnvironment,
  deletePoolsByIds,
  deleteTestEnvironmentsByIds,
} = require('../../../../cypress/integration/common/common-rest-functions.spec');

const poolIdsToRemove = [];
const testEnvironmentIdsToRemove = [];

const firstTestEnvironmentName = 'Test';
const secondTestEnvironmentName = 'Another';
const thirdTestEnvironmentName = 'Yet_Another';

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
  cy.visit('/');
  cy.location('pathname').should('contain', '/');

  poolIdsToRemove.push(addPool('Pool'));
  poolIdsToRemove.push(addPool('Another_Pool'));
  testEnvironmentIdsToRemove.push(addTestEnvironment('Available', firstTestEnvironmentName, ['Pool']));
  testEnvironmentIdsToRemove.push(addTestEnvironment('Available', secondTestEnvironmentName, ['Pool']));
  testEnvironmentIdsToRemove.push(addTestEnvironment('Available', thirdTestEnvironmentName, ['Pool', 'Another_Pool']));
});

Then('I check to see if element position has changed in Another_Pool pools view', () => {
  cy.intercept('PATCH', '/api/test-environments/*').as('patchTestEnvironment');
  cy.wait('@patchTestEnvironment').then(interception => {
    switch (interception.response?.body.name) {
      case thirdTestEnvironmentName:
        expect(interception.response?.body.priorityInfo.viewIndices.Another_Pool).to.eq(0);
        expect(interception.response?.body.priorityInfo.viewIndices.Pool).to.eq(2);
        expect(interception.response?.body.priorityInfo.viewIndices['testEnvironmentViewIndex']).to.eq(2);
        break;
      default:
        throw new Error('Unregistered test environment');
    }
  });
});

afterEach(() => {
  deleteTestEnvironmentsByIds(testEnvironmentIdsToRemove);
  deletePoolsByIds(poolIdsToRemove);
  cy.logout();
});
