const {
  Given,
  Then
} = require("cypress-cucumber-preprocessor/steps");

const yearToTest = new Date().getFullYear();

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
});

Given('I open {word}', (page) => {
  cy.visit(page);
});
Then('I check if the footer has correct background colour', () => {
  cy.get('footer').should('have.css', 'background-color', 'rgb(12, 12, 12)');
});
Then('I check if the footer has a height of 48px', () => {
  cy.get('footer').should('have.css', 'height', '48px');
});
Then('I check if the footer contains the text Developed and Maintained by: Team Thunderbee', () => {
  cy.get('.footer-note span').should('have.text', `${yearToTest} | Developed and Maintained by: Team Thunderbee`);
});

afterEach(() => {
  cy.logout();
});
