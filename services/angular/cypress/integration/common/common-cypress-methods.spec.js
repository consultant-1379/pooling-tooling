const {
  Then,
  When,
  Given
} = require("cypress-cucumber-preprocessor/steps");

Given('I open the page {string}', (urlToVisit) => {
  cy.visit(urlToVisit);
});

When('I click the {string} button', (buttonToClick) => {
  cy.get(buttonToClick).click();
});

When('I click the button {string} that mocks a {string} rest call to {string} with the error {string}' , (buttonWhichPerformsRequest, method, path, errorToThrow) => {
  cy.intercept(method, path, (req) => {
    req.reply({
      statusCode: 400,
      body: {
        error: errorToThrow,
      },
    });
  }).as('errorFromExpress');
  cy.get(buttonWhichPerformsRequest).click();
  cy.wait('@errorFromExpress')
});

When('I click the button {string} that mocks a {string} rest call to {string} with the error {string} where the second request fails' , (buttonWhichPerformsRequest, method, path, errorToThrow) => {
  let requestNumber = 0;
  cy.intercept(method, path, (req) => {
    if (requestNumber === 0) {
      requestNumber = 1;
      req.reply([{}]);
      } else {
      req.reply({
        statusCode: 400,
        body: {
          error: errorToThrow,
        },
      });
    }
  }).as('errorFromExpress');
  cy.get(buttonWhichPerformsRequest).click();
  cy.wait('@errorFromExpress')
});

When('I check if the test environment status is set to {string} on the test-environments page', (testEnvironmentStatus) => {
  cy.intercept('GET', '/api/test-environments/sorted').as('getTestEnvironment');
  cy.wait('@getTestEnvironment', {
    timeout: 30000
  }).then(interception => {
    if (interception.response?.body[0].name) {
      expect(interception.response?.body[0].status).to.eq(testEnvironmentStatus);
    } else {
      throw new Error('Unregistered test environment');
    }
  });
});

When('I change the status of the test environment using the endpoint {string} by clicking the button {string}', (endpointToUse, buttonToClick) => {
  cy.intercept('PATCH', endpointToUse).as('patchTestEnvironment');
  cy.get('button').contains('more_vert').click();
  cy.get('button').contains('Environment Actions').click();
  cy.get('button').contains(buttonToClick).should('be.visible').click();
});

When('I check if the status of the test environment has changed to {string}', (statusTestEnvironmentUpdatedTo) => {
  cy.wait('@patchTestEnvironment', {
    timeout: 30000
  }).then(interception => {
    if (interception.response?.body.name) {
      expect(interception.response?.body.status).to.eq(statusTestEnvironmentUpdatedTo);
    } else {
      throw new Error('Unregistered test environment');
    }
  });
});

When('I drag the the first element down {int} pixels in the table', (numberOfPixelsToDragDownFirstElement) => {
  cy.get('.draggable-table-row').then(elements => {
    const tableRowToDrag = elements[0];
    const coords = tableRowToDrag.getBoundingClientRect();
    tableRowToDrag.dispatchEvent(new MouseEvent('mousemove'));
    tableRowToDrag.dispatchEvent(new MouseEvent('mousedown'));
    tableRowToDrag.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }));
    tableRowToDrag.dispatchEvent(new MouseEvent('mousemove', { clientX: coords.x, clientY: coords.y + numberOfPixelsToDragDownFirstElement }));
    tableRowToDrag.dispatchEvent(new MouseEvent('mouseup'));
  });
});

Then('I expect the environment to be at index {int} in the list of envs and at index {int} in the list of Pools', (indexOfPool, indexOfEnvironment) => {
  cy.intercept('PATCH', '/api/test-environments/*').as('patchTestEnvironment');
  cy.wait('@patchTestEnvironment').then(interception => {
    expect(interception.response?.body.priorityInfo.viewIndices.Pool).to.eq(indexOfPool);
    expect(interception.response?.body.priorityInfo.viewIndices['testEnvironmentViewIndex']).to.eq(indexOfEnvironment);
  });
});

Then('a mat dialog with the class {string} appears which says {string}', (matDialogClass, dialogText) => {
  cy.get(matDialogClass).should('have.text', dialogText);
});

Then('a snackbar with the class {string} appears which says {string}', (snackbarClass, snackbarText) => {
  cy.get(snackbarClass).should('include.text', snackbarText);
});

When('I click the {string} element', (elementToClick) => {
  cy.get(elementToClick).click();
});

Then('I check if the {string} display is none', (elementToCheck) => {
  cy.get(elementToCheck).should("have.css" , "display",  "none");
});

Then('I check if the {string} display is visable', (elementToCheck) => {
  cy.get(elementToCheck).should("not.have.css" , "display",  "none");
});

Then ('I check if the {string} div is visible', (elementToCheck) => {
  cy.get(elementToCheck).should('be.visible')
});

Then ('I check if the {string} div is not visible', (elementToCheck) => {
  cy.get(elementToCheck).should('not.be.visible')
});

When('the screen width is {int} pixels', (px) => {
  cy.viewport(px , 800)
});

Then ('I check if the {string} button is visible', (elementToCheck) => {
  cy.get(elementToCheck).should('be.visible')
});

Then ('I check if the {string} button is not visible', (elementToCheck) => {
  cy.get(elementToCheck).should('not.be.visible')
});

When(`I type {string} as the {string}`, (input, formControlName) => {
  cy.get(`[formcontrolname="${formControlName}"`)
    .type(input).should('have.value', input)
    .wait(250)
    .should('have.value', input);
});

When('the additional info column should display {string}', (expectedText) => {
  cy.get('.col-additionalInfo').should('contain.text', expectedText);
});

When('the comments column should display {string}', (expectedText) => {
  cy.get('app-test-environment-comments .mat-input-element').should('have.value', expectedText);
});

Then('a mat dialog with the class {string} closes', (matDialogClass) => {
  cy.get(matDialogClass).should('not.be.visible')
});
