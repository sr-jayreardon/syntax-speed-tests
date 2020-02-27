const { TestRigTest } = require('../lib/testRig');
const BaseRig = require('../lib/baseRig');

const count = 100000000;
const cases = 100000;
const depth = 6;

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

tests.push(new TestRigTest('fast defaulting ternary', (testCase) => {
  let newCase = testCase || [];
  newCase = Array.isArray(newCase) ? newCase : [newCase];
}));

function generateTestCases(count, depth) {
  const testCases = [];
  for (let itr = 0; itr < count; itr++) {
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
  return testCases;
}

class ArrayNormalizationFilterRig extends BaseRig {
  constructor(logger) {
    super(
      'Array Normalization via Array Concat vs. if-else ternary vs. fast defaulting ternary',
      count,
      cases,
      depth,
      tests,
      generateTestCases,
      logger
    );
  }
}

module.exports = ArrayNormalizationFilterRig;
