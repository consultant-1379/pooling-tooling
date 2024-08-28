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

Then('I click the Environment Logs button, it redirects to a new page', () => {
  cy.get('table').scrollTo('right', { ensureScrollable: false })
  cy.get('button').contains('more_vert').click();
  cy.window().then(win => {
    cy.stub(win, 'open').as('open')
  })
  cy.get('button').contains('Environment Logs').click();
  cy.get('@open').should('be.called');
});

afterEach(() => {
  deleteTestEnvironmentsByIds(testEnvironmentIdsToRemove);
  deletePoolsByIds(poolIdsToRemove);
  cy.logout();
});
