require('cypress-xpath');

const {
  When
} = require("cypress-cucumber-preprocessor/steps");

const {
  addPool,
  addTestEnvironment,
  deletePoolsByIds,
  deleteTestEnvironmentsByIds,
  updateTestEnvironment,
} = require('../../../../cypress/integration/common/common-rest-functions.spec');

const poolIdsToRemove = [];
const testEnvironmentIdsToRemove = [];

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
});

before(() => {
  poolIdsToRemove.push(addPool('Pool'));
  testEnvironmentIdsToRemove.push(addTestEnvironment('Available', 'test-env-cypress', ['Pool']));
});

When('I choose test_pool as the pool', () => {
  cy.get('.poolSelect').click()
    .get('.item2 li:first-child').click();
});


When(`I type {string} as the test environment name`, (testEnvName) => {
  cy.get('input')
    .type(testEnvName).should('have.value', testEnvName)
    .wait(250)
    .should('have.value', testEnvName);
});

When(`I type {string} to confirm`, (testEnvName) => {
  cy.get('.confirm-input .mat-input-element')
    .type(testEnvName)
    .wait(250)
    .should('have.value', testEnvName);
});

When(`I type {string} for each form field in the {string} test environment form, then verify each field says {string}`, (textToType, formField, stringToVerify) => {
  cy.get('form').then(() => {
    const amount = Cypress.$('mat-form-field').length;
    for (let i = 1; i < amount; i++) {
      cy.xpath(`//*[@id='mat-dialog-0']/app-${formField}-test-environment/div/div[1]/form/div/mat-form-field[${i}]/div/div[1]/div[3]/input`).click()
        .type(textToType)
        .wait(250)
        .should('have.value', (stringToVerify));
    }
  });
});

When(`an update event is detected for the environment`, () =>{
  const updateData = {
    properties: {
      version: '1.2.3'
    },
  };
  updateTestEnvironment(testEnvironmentIdsToRemove[0], updateData);
});

after(() => {
  deleteTestEnvironmentsByIds(testEnvironmentIdsToRemove);
  cy.wait(2000);
  deletePoolsByIds(poolIdsToRemove);
});

afterEach(() => {
  cy.logout();
})
