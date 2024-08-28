const production = Cypress.env("production")

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
});

Then('I see the correct title text', () => {
  let expectedText = ' Resource Pooling Tool ';
  if (!Cypress.env("production")) {
    expectedText += '(DEV)';
  } else {
    expectedText += '(STAGING)';
  };
  cy.get('.eb-system-bar-top-menu-name').should('have.text', expectedText);
});