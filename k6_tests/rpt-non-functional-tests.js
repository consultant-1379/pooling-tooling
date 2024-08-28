import http from 'k6/http';
import { sleep } from 'k6';

import {
    HOST_URL
} from './constants/constants.js';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<900'],
  },
  vus: 50,
  duration: '5m'
};

export default function () {
    http.get(`http://${HOST_URL}/api/test-environments`);
    sleep(1);
}
