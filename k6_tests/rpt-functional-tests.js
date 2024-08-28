import * as authFlows from './functional_test_flows/auth-flows.js';
import * as poolFlows from './functional_test_flows/pool-flows.js';
import * as testEnvironmentFlows from './functional_test_flows/test-environment-flows.js';

export const options = {
    scenarios: {
        Auth: {
            executor: 'per-vu-iterations',
            vus: 1,
            iterations: 1,
            exec: 'auth',
            env: {
                description: 'This test runs a successful login and unsuccessful login'
            },
            startTime: '0s'
        },
        Create_Retrieve_Delete_Pool: {
            executor: 'per-vu-iterations',
            vus: 1,
            iterations: 1,
            exec: 'createRetrieveDeletePool',
            env: {
                description: 'This test runs the create pool, retrieve pool and delete pool flow'
            },
            startTime: '2s'
        },
        Create_Retrieve_Delete_Test_Environment: {
            executor: 'per-vu-iterations',
            vus: 1,
            iterations: 1,
            exec: 'createRetrieveDeleteTestEnvironment',
            env: {
                description: 'This test runs the create test environment, retrieve test environment and delete test environment flow'
            },
            startTime: '4s'
        },
        Unreserve_Environment: {
            executor: 'per-vu-iterations',
            vus: 1,
            iterations: 1,
            exec: 'unreserveTestEnvironment',
            env: {
                description: 'This test reserves a test environment, then unreserves a test environment'
            },
            startTime: '8s'
        },
        Quarantine_Test_Environment: {
            executor: 'per-vu-iterations',
            vus: 1,
            iterations: 1,
            exec: 'quarantineTestEnvironment',
            env: {
                description: 'This test reserves a test environment, then quarantines a test environment'
            },
            startTime: '12s'
        },
        Update_Test_Environment: {
            executor: 'per-vu-iterations',
            vus: 1,
            iterations: 1,
            exec: 'updateTestEnvironmentDetails',
            env: {
                description: 'This test updates a test environment, then verifies the test environment was updated'
            },
            startTime: '16s'
        },
    },
    thresholds: {
        checks: [{ threshold: 'rate == 1.00', abortOnFail: true }],
    },
};

export function auth() {
    authFlows.loginFlow();
    authFlows.incorrectLoginFlow();
}

export function createRetrieveDeletePool() {
    poolFlows.createPoolFlow();
    poolFlows.getPoolByNameFlow();
    poolFlows.deletePoolFlow();
}

export function createRetrieveDeleteTestEnvironment() {
    poolFlows.createPoolFlow();
    testEnvironmentFlows.createTestEnvironmentFlow();
    testEnvironmentFlows.getTestEnvironmentByNameFlow();
    testEnvironmentFlows.deleteTestEnvironmentFlow();
    poolFlows.deletePoolFlow();
}

export function unreserveTestEnvironment() {
    poolFlows.createPoolFlow();
    testEnvironmentFlows.createTestEnvironmentFlow();
    testEnvironmentFlows.unreserveTestEnvironmentFlow();
    testEnvironmentFlows.deleteTestEnvironmentFlow();
    poolFlows.deletePoolFlow();
}

export function quarantineTestEnvironment() {
    poolFlows.createPoolFlow();
    testEnvironmentFlows.createTestEnvironmentFlow();
    testEnvironmentFlows.quarantineTestEnvironmentFlow();
    testEnvironmentFlows.deleteTestEnvironmentFlow();
    poolFlows.deletePoolFlow();
}

export function updateTestEnvironmentDetails() {
    poolFlows.createPoolFlow();
    testEnvironmentFlows.createTestEnvironmentFlow();
    testEnvironmentFlows.updateTestEnvironmentDetails();
    testEnvironmentFlows.deleteTestEnvironmentFlow();
    poolFlows.deletePoolFlow();
}