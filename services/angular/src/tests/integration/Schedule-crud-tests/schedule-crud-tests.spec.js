require('cypress-xpath');

const {
  When
} = require("cypress-cucumber-preprocessor/steps");

const {
  addPool,
  addSchedule,
  deletePoolsByIds,
  deleteSchedulesByIds,
  updateSchedule,
} = require('../../../../cypress/integration/common/common-rest-functions.spec');

const poolIdsToRemove = [];
const scheduleIdsToRemove = [];

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
});

before(() => {
  poolIdsToRemove.push(addPool('Pool'));
  scheduleIdsToRemove.push(addSchedule(false, 'test-sch-cypress'));
});

When(`I type {string} as the schedule name`, (scheduleName) => {
  cy.get('input')
    .type(scheduleName).should('have.value', scheduleName)
    .wait(250)
    .should('have.value', scheduleName);
});

When(`I add {string} as the {string}`, (input , formControlName) => {
  cy.get(`[formcontrolname="${formControlName}"]`)
    .wait(150)
    .type(input)
    .wait(150)
    .should('have.value', "test" + input);
});

When('I choose Off as the Schedule Enabled option', () => {
  cy.get(`[formcontrolname="scheduleEnabled"]`)
  .invoke('attr', 'ng-reflect-model')
  .should('eq', 'false');
});

When('I choose Off as the Retention Policy Enabled', () => {
  cy.get(`[formcontrolname="retentionPolicyEnabled"]`)
  .invoke('attr', 'ng-reflect-model')
  .should('eq', 'false');
});

When('I choose {string} as the Type Of Items To Schedule', (type) => {
  cy.get(`[formcontrolname="typeOfItemsToSchedule"]`)
  .children('mat-radio-button')
  .contains(type).click()
  .wait(250);
});

When('I choose {string} as the pool', () => {
  cy.get('.poolSelect').click()
  .within((el) => {
    cy.get('.item2 li:first-child').click();
    })
});

When('I choose {string} as the Schedule Type', () => {
  cy.get('.scheduleTypeSelect').click()
    .within((el) => {
    cy.get('.item2 li:first-child').click();
    })
});

When('I choose {string} as the Project Area', () => {
  cy.get('.projectAreaSelect').click()
  .within((el) => {
    cy.get('.item2 li:first-child').click();
    })
});

When('I choose Off as the as Retention Policy Enabled', () => {
  cy.get('#retention-enabled-off-button').click()
});

When(`I type {string} to confirm`, (scheduleName) => {
  cy.get('.confirm-input .mat-input-element')
    .type(scheduleName)
    .wait(250)
    .should('have.value', scheduleName);
});

When(`an update event is detected for the schedule`, () => {
  const updateData = {
    refreshData: {
      spinnakerPipelineName: 'test_pipeline'
    },
    "createdOn": "2024-01-31T16:41:04.913Z"
   };
  updateSchedule(scheduleIdsToRemove[0], updateData);
});

after(() => {
  deleteSchedulesByIds(scheduleIdsToRemove);
  cy.wait(2000);
  deletePoolsByIds(poolIdsToRemove);
});

afterEach(() => {
  cy.logout();
})
