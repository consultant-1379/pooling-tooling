// Login Command
Cypress.Commands.add('login', (username, password) => {
  cy.visit('#/login')
  cy.get('input[name="signum"]')
    .type(username).should('have.value', username)
    .should('have.value', username)
  cy.get('input[name="password"]')
    .type(password).should('have.value', password)
    .should('have.value', password)
  cy.get('.login-button').click()
  cy.location().should((location) => {
    expect(location.href).to.eq(`${Cypress.config('baseUrl')}/#/`);
  });
})

// Logout Command
Cypress.Commands.add('logout', () => {
  cy.get('.logout-button').click({ multiple: true, force: true });
  cy.location().should((location) => {
    expect(location.href).to.eq(`${Cypress.config('baseUrl')}/#/login`);
  });
})

