import http from 'k6/http';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';

import {
    HOST_URL
} from '../constants/constants.js';

export function createPoolFlow() {
    const testPool = {
        poolName: 'testPool',
        creatorDetails: {
            name: 'nameValue',
            area: 'areaValue',
        },
    };

    const createPoolResponse = http.post(`http://${HOST_URL}/api/pools`, JSON.stringify(testPool), {
        headers: { 'Content-Type': 'application/json' },
    });
    expect(createPoolResponse.status, 'create response status').to.equal(201);
}

export function getPoolByNameFlow() {
    const getPoolResponse = http.get(`http://${HOST_URL}/api/pools/name/testPool`);

    expect(getPoolResponse.status, 'get response status').to.equal(200);
    expect(getPoolResponse).to.have.validJsonBody();
    expect(getPoolResponse.json(), 'pool').to.be.an('array');
    expect(getPoolResponse.json(), 'pool').to.have.lengthOf(1);
}

export function deletePoolFlow() {
    const getPoolResponse = http.get(`http://${HOST_URL}/api/pools/name/testPool`);
    const poolID = getPoolResponse.json()[0].id;

    const deletePoolResponse = http.del(`http://${HOST_URL}/api/pools/${poolID}`);

    expect(deletePoolResponse.status, 'delete response status').to.equal(204);
}
