const { TestRig, TestRigTest } = require('./lib/testRig');

const count = 100000000;
const cases = 100000;
const depth = 6;

// Creating Test Cases
const testCases = [];
for (let itr = 0; itr < cases; itr++) {
  const sel = ~~(Math.random() * depth) - 2;
  let fil;
  if (sel === -1) {
    fil = '1234512';
  } else if (sel >= 0) {
    fil = [];
    for (let jtr = 0; jtr < sel; jtr++) {
      fil.push('123423512');
    }
  }
  testCases.push(fil);
}

const tests = [];
tests.push(new TestRigTest('[].concat', (testCase) => {
  const newCase = [].concat(testCase);
}));

tests.push(new TestRigTest('if-else ternary', (testCase) => {
  let newCase = [];
  if (testCase) {
    newCase = Array.isArray(testCase) ? testCase : [testCase];
  }
}));

tests.push(new TestRigTest('fast defaulting', (testCase) => {
  let newCase = testCase || [];
  newCase = Array.isArray(newCase) ? newCase : [newCase];
}));

const rig = new TestRig(count, testCases, tests, { projectionCounts: count * 1000, projectionGranularity: 'm' });
rig.run();
