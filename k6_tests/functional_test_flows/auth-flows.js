import http from 'k6/http';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';

import {
    HOST_URL
} from '../constants/constants.js';

export function loginFlow() {
    const validUserData = {
        signum: 'cypress_test_username',
        password: 'cypress_test_password'
    };

    const loginResponse = http.post(`http://${HOST_URL}/api/auth/login`, JSON.stringify(validUserData), {
        headers: { 'Content-Type': 'application/json' },
    });

    expect(loginResponse.status).to.equal(200);
    expect(loginResponse).to.have.validJsonBody();
    expect(loginResponse.json().message, 'message').to.be.equal('Login Success');
    expect(loginResponse.json().success, 'success').to.be.equal(true);
    expect(loginResponse.json().username, 'username').to.be.equal('cypressTest');
    expect(loginResponse.json().email, 'email').to.be.equal('cypresstest@mail.ie');
    expect(loginResponse.json().forename, 'forename').to.be.equal('cypress');
    expect(loginResponse.json().surname, 'surname').to.be.equal('test');
}

export function incorrectLoginFlow() {
    const invalidUserData = {
        signum: 'incorrect_test_signum',
        password: 'incorrect_test_password'
    };

    const loginFailureResponse = http.post(`http://${HOST_URL}/api/auth/login`, JSON.stringify(invalidUserData), {
        headers: { 'Content-Type': 'application/json' },
    });

    expect(loginFailureResponse.status).to.equal(200);
    expect(loginFailureResponse).to.have.validJsonBody();
    expect(loginFailureResponse.json().message, 'message').to.be.equal('Login Failed');
    expect(loginFailureResponse.json().success, 'success').to.be.equal(false);
}
