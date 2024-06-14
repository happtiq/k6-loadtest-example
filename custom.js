import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Rate } from 'k6/metrics';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 20,
  // A string specifying the total duration of the test run.
  duration: '1m',
};

// Custom Metrics
const chacheHit = new Counter('cache_hit');
const cacheMiss = new Counter('cache_miss');
const cacheUnknown = new Counter('cache_unknown');
const cacheRate = new Rate('cache_rate');


// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function() {
  const res = http.get('https://example.com/');

  switch(res.headers['Cache-Status']) {
    case 'hit':
      chacheHit.add(1);
      cacheRate.add(true);
      break;
    case 'miss':
      cacheMiss.add(1);
      cacheRate.add(false);
      break;
    default:
      cacheUnknown.add(1);
      cacheRate.add(false);
  }
  console.log(res.headers['Cache-Status'] + " in " + res.headers['Cache_id']);
  sleep(5);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}