const {
  When, Then
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

When('I click the edit comments button', () => {
  cy.get('.edit-small').first().click();
});

When('I type {string} into the comments input', (textForComments) => {
  cy.get('app-test-environment-comments .mat-input-element').type(textForComments);
});

Then('I ensure the test environment in the database has the comments of {string}', (commentsInDatabase) => {
  cy.intercept('PATCH', '/api/test-environments/*').as('patchTestEnvironment');
  cy.get('.edit-small').last().click();
  cy.wait('@patchTestEnvironment').then(interception => {
    expect(interception.response?.body.comments).to.eq(commentsInDatabase);
  });
});

When('I click the confirm button to save the comments', () => {
  cy.get('.edit-small').last().click();
  cy.wait(500);
});

When('I click the undo changes to comments', () => {
  cy.get('.undo-small').last().click();
});

Then('I ensure the comments was not updated and is instead reverted to {string}', (textCommentsShouldHave) => {
  cy.get('app-test-environment-comments .mat-input-element').should('have.value', textCommentsShouldHave);
});

When('I type a multi-line string into the input', () => {
  cy.get('app-test-environment-comments .mat-input-element').type('A \n B \n C \n D \n E \n F');
});

Then('I ensure the height of the comments is {string} {int}', (operationToCheck, valueToCheck) => {
  cy.get('app-test-environment-comments .mat-input-element').invoke('height').should(`be.${operationToCheck}`, valueToCheck);
})

When('I click the resize text area button', () => {
  cy.get('.resize-text-area').first().click();
})

When('I click the button to downsize the expanded text area', () => {
  cy.get('.undo-small').first().click();
});

afterEach(() => {
  deleteTestEnvironmentsByIds(testEnvironmentIdsToRemove);
  deletePoolsByIds(poolIdsToRemove);
  cy.logout();
});
