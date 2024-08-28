require('cypress-xpath');

const {
  When,
  Then
} = require("cypress-cucumber-preprocessor/steps");

When('I type {string} into signum input', (testForSignumInput) => {
  cy.get('input[name="signum"]')
    .type(testForSignumInput).should('have.value', testForSignumInput)
});

When('I type {string} into password input', (testForPasswordInput) => {
  cy.get('input[name="password"')
    .type(testForPasswordInput).should('have.value', testForPasswordInput)
});

When('I click login button', () => {
  cy.get('.login-button').click()
});

Then('I should redirect to the home page', () => {
  cy.location().should((location) => {
    expect(location.href).to.eq(`${Cypress.config('baseUrl')}/#/`);
  });
  cy.wait(1000);
});

Then('a span with the class username should show {string} in navbar', (testForUsernameClass) => {
  cy.get('.username').should('include.text', testForUsernameClass);
})

When('I click the logout button', () => {
  cy.get('.logout-button').click({ multiple: true, force: true });
})

Then('I should redirect to the login page', () => {
  cy.location().should((location) => {
    expect(location.href).to.eq(`${Cypress.config('baseUrl')}/#/login`);
  });
})

Then('a span with the class kc-feedback-text appears which says {string}', (loginErrorMessage) => {
  cy.wait(1000);
  cy.get('.kc-feedback-text').should('include.text', loginErrorMessage);
})
