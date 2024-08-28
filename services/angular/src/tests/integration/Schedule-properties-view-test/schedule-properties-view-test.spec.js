require('cypress-xpath');

const {
  Given,
  Then,
} = require("cypress-cucumber-preprocessor/steps");

const {
  addPool,
  addSchedule,
  deletePoolsByIds,
  deleteSchedulesByIds,
} = require('../../../../cypress/integration/common/common-rest-functions.spec');

const poolIdsToRemove = [];
const scheduleIdsToRemove = [];

function checkData(data) {
  var count = 0;
  cy.xpath('//*[@class="ng-star-inserted"]/app-dynamic-schedule-page/div/div/div/table').find('td').each(col => {
    cy.get(col).should('have.text', data[count]);
    count++;
  });
  count = 0;
}

function checkColour() {
  cy.get('.modalHeader').should('have.css', 'background-color', 'rgb(250, 210, 45)');
}

beforeEach(() => {
  cy.login('cypress_test_username', 'cypress_test_password');
  poolIdsToRemove.push(addPool('Pool'));
  scheduleIdsToRemove.push(addSchedule(false, 'test_sch'));

  cy.visit('#/schedules');
  cy.location().should((location) => {
    expect(location.href).to.contain('/#/schedules');
  });
});


Then('I check if all columns have data', () => {
  const data = [' test_sch ', ' project area ', ' Invalid Pool id ', 'At 02:01 AM, on day 3 of the month, and on Friday, only in April ("1 2 3 4 5")', ' test ', ' test ', 'Disabled ', ' view '];
  checkData(data);
});

afterEach(() => {
  deleteSchedulesByIds(scheduleIdsToRemove);
  deletePoolsByIds(poolIdsToRemove);
  cy.logout();
});
