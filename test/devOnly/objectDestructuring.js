const { TestRig, TestRigTest } = require('./lib/testRig');

const count = 1000000000;

// Creating Test Cases
const testCases = {
  a: 12,
  b: 3.14159265358979,
  c: 'test',
  d: true,
  e: null
};

const tests = [];
tests.push(new TestRigTest('object destructuring', (testCase, idx) => {
  const { a, b, c, d, e } = testCase;
}));

tests.push(new TestRigTest('direct assignment', (testCase, idx) => {
  const a = testCase.a;
  const b = testCase.b;
  const c = testCase.c;
  const d = testCase.d;
  const e = testCase.e;
}));

const rig = new TestRig(count, testCases, tests, { projectionCounts: count * 1000, projectionGranularity: 'h' });
rig.run();
