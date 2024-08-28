const {
  Given,
  Then,
  When
} = require("cypress-cucumber-preprocessor/steps");

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
});

Given('I open {word}', (page) => {
  cy.visit(page);
});
Then('I see the help docs header', () => {
  cy.get('p[id="help-docs-header-h1"]').should('be.visible');
});

Given('I am on the main help docs page', () => {
  cy.visit(`${Cypress.config('baseUrl')}/#/help-docs`);
});
When('I click the button with ID {word}', (button_id) => {
  cy.get(`div[id="${button_id}"]`).click();
});
Then('I should see the help doc with href {word}', (href) => {
  cy.location('href').should('include', `/#/help-docs${href}`);
});

When('I scroll down to {int} px', (px) => {
  cy.scrollTo(0, px)
});
When('I click the button with an id of {word}', (button_id) => {
  cy.get(`#${button_id}`).click();
});
Then('I should return to the top of the page', () => {
  cy.window().its('scrollY').should('equal', 0);
});

afterEach(() => {
  cy.logout();
})
