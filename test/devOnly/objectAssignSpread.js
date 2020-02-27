const { TestRig, TestRigTest } = require('./lib/testRig');

const count = 100000000;
const cases = 100000;

console.log(`Generating ${cases} test cases...`);
// Creating Test Cases
let testCases = [];
let keys = ['a', 'b', 'c', 'd', 'e'];
let values = [12, 3.15212, 'test', true, null];
for (let itr = 0; itr < cases; itr++) {
  let sel = ~~(Math.random() * 7) - 2;
  let test = undefined;
  if (sel >= -1) {
    test = {};
    for (let jtr = 0; jtr < sel; jtr++) {
      test[keys[jtr]] = values[jtr];
    }
  }
  testCases.push(test);
}

const tests = [];
tests.push(new TestRigTest('Object.assign', (testCase, idx) => {
  let newCase = Object.assign({}, testCase);
}));

tests.push(new TestRigTest('spread operator', (testCase, idx) => {
  let newCase = { ...testCase };
}));

const rig = new TestRig(count, testCases, tests, { projectionCounts: count * 1000, projectionGranularity: 'h' });
rig.run();
