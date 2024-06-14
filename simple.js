import http from 'k6/http'

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 20,
  // A string specifying the total duration of the test run.
  duration: '5m',
};

export default function () {
  let res = http.get('https://example.com/')
}
