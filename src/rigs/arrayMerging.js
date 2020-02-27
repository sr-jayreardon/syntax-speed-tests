const { TestRigTest } = require('../lib/testRig');
const BaseRig = require('../lib/baseRig');

const count = 100000000;
const cases = 100000;
const depth = 100;

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

function generateTestCases(count, depth) {
  const testCases = [];
  for (let itr = 0; itr < count; itr++) {
    const sel = ~~(Math.random() * depth);
    const fil = [];
    for (let jtr = 0; jtr < sel; jtr++) {
      fil.push('123423512');
    }
    testCases.push(fil);
  }
  return testCases;
}

class ArrayMergingRig extends BaseRig {
  constructor(logger) {
    super(
      'Array Merging vs. Array Concat vs. Spread Operator vs. For-loop',
      count,
      cases,
      depth,
      tests,
      generateTestCases,
      logger
    );
  }
}

module.exports = ArrayMergingRig;
