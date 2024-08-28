require('cypress-xpath');

const {
  Before,
  When
} = require("cypress-cucumber-preprocessor/steps");

const poolName = 'test_pool';

Before(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
})

Given('I open admin pools page', () => {
  cy.visit('/#/admin/pools');
});

When('I type {string} as the pool name', (poolName) => {
  cy.get('input')
    .type(poolName)
    .wait(250)
    .should('have.value', poolName);
});

When('I choose App staging as the creator area', () => {
  cy.get('.dropdown-btn').click()
    .get('.item2 li:first-child').click();
});

When(`I type ${poolName} to confirm`, () => {
  cy.get('.confirm-input .mat-input-element')
    .type(poolName)
    .wait(250)
    .should('have.value', poolName);
});

after(() => {
  cy.logout();
});
