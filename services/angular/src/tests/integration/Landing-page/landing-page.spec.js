require('cypress-xpath');
const production = Cypress.env("production")

const {
  Given,
  When,
  Then
} = require("cypress-cucumber-preprocessor/steps");

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
});

When('I click the "mat-expansion-panel" element', () => {
  cy.get("mat-expansion-panel").each(($el)=> {
    cy.get($el).click();
  });
});

Then('I check if the "mat-expansion-panel" is expanded', () => {
  cy.get('.mat-expansion-panel').each(($el)=> {
    cy.get($el).should("have.class", "mat-expanded");
  });
});

When('I click the "mat-expansion-panel-header" element', () => {
  cy.get(".mat-expansion-panel-header").eq(0).click();
});
Then('I check if the "mat-expansion-panel" is collapsed', () => {
  cy.get('.mat-expansion-panel').eq(0).should("not.have.class", "mat-expanded");
});


Then('I see the correct header text', () => {
  let expectedText = ' Welcome to the Resource Pooling Tool ';
  if (!Cypress.env("production")) {
    expectedText += '(DEV)';
  } else {
    expectedText += '(Staging)';
  };
  cy.get('.display-1').should('have.text', expectedText);
});

When(`the screen width is {int} pixels`, (px) => {
  cy.viewport(px , 800)
});

Given('I click the {string} link', (routerLinkToClick) => {
  cy.get(`[routerlink="/${routerLinkToClick}"]`).eq(1).click({ force: true });
});

Then('I should redirect to the URL {string}', (urlForRedirect) => {
  cy.location().should((location) => {
    expect(location.href).to.contain(urlForRedirect);
  });
});

afterEach(() => {
  cy.logout();
});
