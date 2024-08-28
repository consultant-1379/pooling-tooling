import http from 'k6/http';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';

import {
    HOST_URL
} from '../constants/constants.js';

export function createTestEnvironmentFlow() {
    const testEnvironment = {
        name: 'testName123',
        status: 'Available',
        pools: ['testPool'],
        properties: {
            product: 'productValue',
            platformType: 'platformTypeValue',
            version: 'versionValue',
            ccdVersion: 'ccdVersionValue',
        },
    };

    const createTestEnvironmentResponse = http.post(`http://${HOST_URL}/api/test-environments`, JSON.stringify(testEnvironment), {
        headers: { 'Content-Type': 'application/json' },
    });

    expect(createTestEnvironmentResponse.status, 'create response status').to.equal(201);
}

export function getTestEnvironmentByNameFlow() {
    const getTestEnvironmentResponse = http.get(`http://${HOST_URL}/api/test-environments/pools/testPool`);

    expect(getTestEnvironmentResponse.status, 'get response status').to.equal(200);
    expect(getTestEnvironmentResponse).to.have.validJsonBody();
    expect(getTestEnvironmentResponse.json(), 'test-environment').to.be.an('array');
    expect(getTestEnvironmentResponse.json(), 'test-environment').to.have.lengthOf(1);
}

export function deleteTestEnvironmentFlow() {
    const getTestEnvironmentResponse = http.get(`http://${HOST_URL}/api/test-environments/pools/testPool`);
    const testEnvironmentID = getTestEnvironmentResponse.json()[0].id;

    const deleteTestEnvironmentResponse = http.del(`http://${HOST_URL}/api/test-environments/${testEnvironmentID}`);

    expect(deleteTestEnvironmentResponse.status, 'delete response status').to.equal(204);
}

export function unreserveTestEnvironmentFlow() {
    const getTestEnvironmentResponse = http.get(`http://${HOST_URL}/api/test-environments/pools/testPool`);
    const patchTestEnvironmentResponse = http.patch(`http://${HOST_URL}/api/test-environments/${getTestEnvironmentResponse.json()[0].id}`, JSON.stringify({ status: 'Reserved' }), {
        headers: { 'Content-Type': 'application/json' },
    });

    expect(patchTestEnvironmentResponse.status, 'patch response status').to.equal(200);
    expect(patchTestEnvironmentResponse).to.have.validJsonBody();
    expect(patchTestEnvironmentResponse.json().status, 'Test Environment status').to.equal('Reserved');

    const patchUnreserveResponse = http.patch(`http://${HOST_URL}/api/pipeline-functions/test-environment-from-reserved-to-available/testName123`);

    expect(patchUnreserveResponse.status, 'patch response status').to.equal(200);
    expect(patchUnreserveResponse).to.have.validJsonBody();
    expect(patchUnreserveResponse.json().status, 'Test Environment status').to.equal('Available');
}

export function quarantineTestEnvironmentFlow() {
    const getTestEnvironmentResponse = http.get(`http://${HOST_URL}/api/test-environments/pools/testPool`);
    const patchTestEnvironmentResponse = http.patch(`http://${HOST_URL}/api/test-environments/${getTestEnvironmentResponse.json()[0].id}`, JSON.stringify({ status: 'Reserved' }), {
        headers: { 'Content-Type': 'application/json' },
    });

    expect(patchTestEnvironmentResponse.status, 'patch response status').to.equal(200);
    expect(patchTestEnvironmentResponse).to.have.validJsonBody();
    expect(patchTestEnvironmentResponse.json().status, 'Test Environment status').to.equal('Reserved');

    const patchQuarantineResponse = http.patch(`http://${HOST_URL}/api/pipeline-functions/test-environment-from-reserved-to-quarantined/testName123`);

    expect(patchQuarantineResponse.status, 'patch response status').to.equal(200);
    expect(patchQuarantineResponse).to.have.validJsonBody();
    expect(patchQuarantineResponse.json().status, 'Test Environment status').to.equal('Quarantine');
}

export function updateTestEnvironmentDetails() {
    const getFirstTestEnvironmentResponse = http.get(`http://${HOST_URL}/api/test-environments/pools/testPool`);
    const patchTestEnvironmentResponse = http.patch(`http://${HOST_URL}/api/test-environments/${getFirstTestEnvironmentResponse.json()[0].id}`, JSON.stringify({ properties: { version: '2.0.0-1010' } }), {
        headers: { 'Content-Type': 'application/json' },
    });

    expect(patchTestEnvironmentResponse.status, 'patch response status').to.equal(200);
    expect(patchTestEnvironmentResponse).to.have.validJsonBody();

    const getSecondTestEnvironmentResponse = http.get(`http://${HOST_URL}/api/test-environments/pools/testPool`);
    expect(getSecondTestEnvironmentResponse.json()[0].properties.version, 'test environment version').to.equal('2.0.0-1010');
}