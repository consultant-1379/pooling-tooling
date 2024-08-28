require('cypress-xpath');

const {
  Given,
  Then
} = require("cypress-cucumber-preprocessor/steps");

const versionFilePath = './VERSION';
let fileVersion, navbarVersion;

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
});

Given('I get the version from VERSION file', () => {
  cy.readFile(versionFilePath).then(version => {
    fileVersion = version.replace('\n','');
  });
});

Then('I get the version from Navbar', () => {
  cy.get('.rpt-version').then(version => {
    navbarVersion = version.text().replace('v.','');
  });
});

Then('I compare both versions against each other', () => {
  expect(fileVersion).to.equal(navbarVersion);
})
