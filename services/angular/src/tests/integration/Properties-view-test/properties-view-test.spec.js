require('cypress-xpath');

const {
  Given,
  Then,
} = require("cypress-cucumber-preprocessor/steps");

const {
  addPool,
  addTestEnvironment,
  deletePoolsByIds,
  deleteTestEnvironmentsByIds,
} = require('../../../../cypress/integration/common/common-rest-functions.spec');

const poolIdsToRemove = [];
const testEnvironmentIdsToRemove = [];

function checkData(data) {
  var count = 0;
  cy.xpath('//*[@id="mat-dialog-0"]/app-dynamic-modal/div/div/table').find('td').each(col => {
    cy.get(col).should('have.text', data[count]);
    count++;
  });
  count = 0;
}

function checkColour() {
  cy.get('.modalHeader').should('have.css', 'background-color', 'rgb(250, 210, 45)');
}

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
  poolIdsToRemove.push(addPool('Pool'));
  testEnvironmentIdsToRemove.push(addTestEnvironment('Available', 'test_env', ['Pool']));
  testEnvironmentIdsToRemove.push(addTestEnvironment('Available', 'test_env2', ['Pool']));

  cy.visit('#/test-environments');
  cy.location().should((location) => {
    expect(location.href).to.contain('/#/test-environments');
  });
});

Given(`I click the 'view' button on {int} element`, (index) => {
  cy.xpath(`//*[@id="cdk-drop-list-0"]/tbody/tr[${index}]/td[4]/app-dynamic-test-environment-properties/a`).click();
});
Then('I check if table head has correct colour', () => {
  checkColour();
});
Then('I check if all columns have data', () => {
  const data = ['Test', 'Test', '1.0', '1.1', 'Test'];
  checkData(data);
});

Then('I check if table head has correct colour', () => {
  checkColour();
});
Then(`I check if all columns have data except 'From State'`, () => {
  const data = ['Test', 'Test', '1.0', '1.1', 'Test'];
  checkData(data);
});

afterEach(() => {
  deleteTestEnvironmentsByIds(testEnvironmentIdsToRemove);
  deletePoolsByIds(poolIdsToRemove);
  cy.logout();
});
