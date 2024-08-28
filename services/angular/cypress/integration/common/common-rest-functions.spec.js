function addPool(name) {
  const poolIdsToRemove = [];
  cy.request({
    method: 'POST',
    url: `${Cypress.config('baseUrl')}/api/pools`,
    failOnStatusCode: true,
    body: {
      creatorDetails: {
        name: 'admin',
        area: 'App Staging',
      },
      poolName: name,
    }
  }).then((response) => {
    poolIdsToRemove.push(response.body.id);
  });
  return poolIdsToRemove;
}

function addTestEnvironment(status, name, pools) {
  const testEnvironmentIdsToRemove = [];
  cy.request({
    method: 'POST',
    url: `${Cypress.config('baseUrl')}/api/test-environments`,
    failOnStatusCode: true,
    body: {
      name: name,
      status: status,
      requestId: '',
      pools: pools,
      properties: {
        product: 'Test',
        platformType: 'Test',
        version: '1.1',
        ccdVersion: 'Test',
        fromState: '1.0',
      },
      stage: '',
      additionalInfo: '',
      comments: '',
      createdOn: 'Wed, 26 Jan 2022 15:00:31 GMT',
      modifiedOn: 'Wed, 26 Jan 2022 15:00:31 GMT',
    },
  }).then((response) => {
    testEnvironmentIdsToRemove.push(response.body.id);
  });
  return testEnvironmentIdsToRemove;
}

function addSchedule(status, name) {
  const scheduleIdsToRemove = [];
  cy.request({
    method: 'POST',
    url: `${Cypress.config('baseUrl')}/api/schedules`,
    failOnStatusCode: true,
    body: {
      scheduleName: name,
      scheduleEnabled: status,
      typeOfItemsToSchedule: "pool",
      refreshData : {
        spinnakerPipelineApplicationName: "test",
        spinnakerPipelineName: "test",
        itemsToScheduleIds: [
            "clfakefakefakefakefake123"
        ]
      },
      retentionPolicyData: {
        "retentionPolicyEnabled": false
      },
      scheduleOptions: {
        scheduleType: "test Schedule",
        projectArea: "project area",
        cronSchedule: "1 2 3 4 5"
      },
      createdOn: 'Wed, 26 Jan 2022 15:00:31 GMT',
      modifiedOn: 'Wed, 26 Jan 2022 15:00:31 GMT',
    },
  }).then((response) => {
    scheduleIdsToRemove.push(response.body.id);
  });
  return scheduleIdsToRemove;
}

function deletePoolsByIds(poolIdsToRemove) {
  for (const poolId of poolIdsToRemove) {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.config('baseUrl')}/api/pools/${poolId}`,
      failOnStatusCode: true,
    });
  }
  poolIdsToRemove.length = 0;
}

function deleteTestEnvironmentsByIds(testEnvironmentIdsToRemove) {
  for (const testEnvironmentId of testEnvironmentIdsToRemove) {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.config('baseUrl')}/api/test-environments/${testEnvironmentId}`,
      failOnStatusCode: true,
    });
  }
  testEnvironmentIdsToRemove.length = 0;
}

function deleteSchedulesByIds(scheduleIdsToRemove) {
  for (const scheduleId of scheduleIdsToRemove) {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.config('baseUrl')}/api/schedules/${scheduleId}`,
      failOnStatusCode: true,
    });
  }
  scheduleIdsToRemove.length = 0;
}

function updateTestEnvironment(testEnvironmentId, updateData) {
  return cy.request({
    method: 'PATCH',
    url: `${Cypress.config('baseUrl')}/api/test-environments/${testEnvironmentId}`,
    failOnStatusCode: true,
    body: updateData,
  });
}

function updateSchedule(scheduleId, updateData) {
  return cy.request({
    method: 'PATCH',
    url: `${Cypress.config('baseUrl')}/api/schedules/${scheduleId}`,
    failOnStatusCode: true,
    body: updateData,
  });
}

module.exports = { addPool, addTestEnvironment, addSchedule, deletePoolsByIds, deleteTestEnvironmentsByIds, deleteSchedulesByIds, updateTestEnvironment, updateSchedule };
