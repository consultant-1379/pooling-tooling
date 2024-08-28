const {
  Given,
  Then
} = require("cypress-cucumber-preprocessor/steps");

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
  cy.visit('/');
  cy.location('pathname').should('contain', '/');
});

Given('I click Resource Pooling Tool navbar link', () => {
  cy.get('.nav-link a').eq(0).click({ force: true });
});

Given('I click the {string} navbar link', (routerLinkToClick) => {
  cy.get(`[routerlink="/${routerLinkToClick}"]`).eq(0).click({ force: true });
});

Then('I should redirect to the URL {string}', (urlForRedirect) => {
  cy.location().should((location) => {
    expect(location.href).to.contain(urlForRedirect);
  });
});

afterEach(() => {
  cy.logout();
});
