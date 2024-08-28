const {
  When
} = require("cypress-cucumber-preprocessor/steps");

const {
  addPool,
  addTestEnvironment,
  deletePoolsByIds,
  deleteTestEnvironmentsByIds,
} = require('../../../../cypress/integration/common/common-rest-functions.spec');

const poolIdsToRemove = [];
const testEnvironmentIdsToRemove = [];

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
  poolIdsToRemove.push(addPool('Pool'));
  testEnvironmentIdsToRemove.push(addTestEnvironment('Available', 'Test', ['Pool']));
});

When('I mock the response from changing the status of the test environment to Quarantine but instead, I throw an error', () => {
  cy.intercept('PATCH', '/api/test-environments/*', (req) => {
    req.reply({
      statusCode: 400,
      body: {
        error: 'Generic error from express.',
      }
    })
  }).as('patchTestEnvironmentFailure');
  cy.get('button').contains('more_vert').click();
  cy.get('button').contains('Environment Actions').click();
  cy.get('button').contains('Set Test Environment To Quarantine').click();
  cy.wait('@patchTestEnvironmentFailure');
});

When('I mock the response from changing the status of the test environment to Quarantine by changing the modifiedOn of the retrieved test environment', () => {
  cy.intercept('GET', '/api/test-environments/*', (req) => {
    req.reply({
      statusCode: 200,
      body: [
        {
          modifiedOn: 'This will differ from modifiedOn of the test environment in the browser',
        }
      ]
    })
  }).as('getTestEnvironment');

  cy.get('button').contains('more_vert').click();
  cy.get('button').contains('Environment Actions').click();
  cy.get('button').contains('Set Test Environment To Quarantine').click();
  cy.wait('@getTestEnvironment')
})

afterEach(() => {
  deleteTestEnvironmentsByIds(testEnvironmentIdsToRemove);
  deletePoolsByIds(poolIdsToRemove);
  cy.logout();
});
