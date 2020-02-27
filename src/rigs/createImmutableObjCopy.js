const { TestRigTest } = require('../lib/testRig');
const BaseRig = require('../lib/baseRig');

const count = 100000000;
const cases = 100000;
const depth = 7;

const tests = [];
tests.push(new TestRigTest('Object.assign', (testCase, idx) => {
  let newCase = Object.assign({}, testCase);
}));

tests.push(new TestRigTest('spread operator', (testCase, idx) => {
  let newCase = { ...testCase };
}));

function generateTestCases(count, depth) {
  let testCases = [];
  let keys = ['a', 'b', 'c', 'd', 'e'];
  let values = [12, 3.15212, 'test', true, null];
  for (let itr = 0; itr < count; itr++) {
    let sel = ~~(Math.random() * depth) - 2;
    let test = undefined;
    if (sel >= -1) {
      test = {};
      for (let jtr = 0; jtr < sel; jtr++) {
        test[keys[jtr]] = values[jtr];
      }
    }
    testCases.push(test);
  }
  return testCases;
}

class CreateImmutableObjCopyRig extends BaseRig {
  constructor(logger) {
    super(
      'Creating an Immutable Copy of Object via Object.assign vs. Spread Operator',
      count,
      cases,
      depth,
      tests,
      generateTestCases,
      logger
    );
  }
}

module.exports = CreateImmutableObjCopyRig;
