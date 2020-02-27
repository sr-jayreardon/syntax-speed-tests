const { TestRig, TestRigTest } = require('./lib/testRig');

const count = 100000000;
const cases = 100000;
const depth = 6;

// Creating Test Cases
const testCases = [];
for (let itr = 0; itr < cases; itr++) {
  const sel = ~~(Math.random() * depth);
  const fil = [];
  for (let jtr = 0; jtr < sel; jtr++) {
    fil.push('123423512');
  }
  testCases.push(fil);
}

const tests = [];
tests.push(new TestRigTest('Array.concat', (testCase, idx, next) => {
  const newCase = testCase.concat(next);
}));

tests.push(new TestRigTest('spread operator concat', (testCase, idx, next) => {
  const newCase = [...testCase, ...next];
}));

tests.push(new TestRigTest('manual concat for-loop', (testCase, idx, next) => {
  const newCase = [];
  for (let jtr = 0; jtr < testCase.length; jtr++) {
    newCase.push(testCase[jtr]);
  }
  for (let jtr = 0; jtr < next.length; jtr++) {
    newCase.push(next[jtr]);
  }
}));

const rig = new TestRig(count, testCases, tests, { projectionCounts: count * 1000, projectionGranularity: 'h' });
rig.run();
