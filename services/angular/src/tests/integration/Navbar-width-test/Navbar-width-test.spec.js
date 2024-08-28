const {
    Then
} = require("cypress-cucumber-preprocessor/steps");

beforeEach(() => {
cy.login('cypress_test_username', 'cypress_test_password');
cy.visit('/');
cy.location('pathname').should('contain', '/');
});

Then('I check if the {string} has class {string}', (id, attribute ) => {
    cy.get(id).should("have.class" , attribute );
  });

Then('I check if the {string} does not have class {string}', (id, attribute ) => {
    cy.get(id).should("not.have.class" , attribute );
  });

afterEach(() => {
cy.logout();
});
