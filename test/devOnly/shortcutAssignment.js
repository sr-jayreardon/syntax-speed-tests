const { TestRig, TestRigTest } = require('./lib/testRig');

let count = 100000000;

// Creating Test Cases
let testCase = {
  a: 12,
  b: 3.14159265358979,
  c: 'test',
  d: true,
  e: null
}

const tests = [];
tests.push(new TestRigTest('fn return /w shortcut object syntax', (testCase) => {
  let { a, b, c, d, e } = testCase;
  let newCase = (() => { return { a, b, c, d, e }; })();
}));

tests.push(new TestRigTest('fn return /w long form object syntax', (testCase) => {
  let newCase = (() => { return { a: testCase.a, b: testCase.b, c: testCase.c, d: testCase.d, e: testCase.e }; })();
}));

tests.push(new TestRigTest('fn return /w mixed object syntax', (testCase) => {
  let { a, b, e } = testCase;
  let newCase = (() => { return { a, b, c: testCase.c, d: testCase.d, e, f: true }; })();
}));

tests.push(new TestRigTest('fn return /w Object.assign', (testCase) => {
  let newCase = (() => { return Object.assign({}, testCase); })();
}));

tests.push(new TestRigTest('fn return /w object spread', (testCase) => {
  let newCase = (() => { return { ...testCase }; })();
}));

const rig = new TestRig(count, testCase, tests, { projectionCounts: count * 1000, projectionGranularity: 'h' });
rig.run();
