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

afterEach(() => {
  deleteTestEnvironmentsByIds(testEnvironmentIdsToRemove);
  deletePoolsByIds(poolIdsToRemove);
  cy.logout();
});
