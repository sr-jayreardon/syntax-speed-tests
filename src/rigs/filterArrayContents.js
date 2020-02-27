const { TestRigTest } = require('../lib/testRig');
const BaseRig = require('../lib/baseRig');

const count = 100000000;
const cases = 5000000;
const depth = 6;

const tests = [];
tests.push(new TestRigTest('for loop /w inner if-else', (testCase, idx) => {
  const criteria = idx % 10;
  const newCase = [];
  if (testCase && Array.isArray(testCase)) {
    for (let jtr = 0; jtr < testCase.length; jtr++) {
      const word = testCase[jtr];
      if (word && word.length >= criteria) {
        newCase.push(testCase);
      }
    }
  }
}));

tests.push(new TestRigTest('for-of loop /w inner if-else', (testCase, idx) => {
  const criteria = idx % 10;
  const newCase = [];
  if (testCase && Array.isArray(testCase)) {
    for (const word of testCase) {
      if (word && word.length >= criteria) {
        newCase.push(testCase);
      }
    }
  }
}));

tests.push(new TestRigTest('Array.forEach', (testCase, idx) => {
  const criteria = idx % 10;
  const newCase = [];
  if (testCase && Array.isArray(testCase)) {
    testCase.forEach((word) => {
      if (word && word.length >= criteria) {
        newCase.push(word);
      }
    });
  }
}));

tests.push(new TestRigTest('Array.filter', (testCase, idx) => {
  const criteria = idx % 10;
  if (testCase && Array.isArray(testCase)) {
    const newCase = testCase.filter((word) => {
      if (word) {
        return word.length >= criteria;
      }
    });
  }
}));

function generateTestCases(count, depth) {
  const testCases = [];
  const baseword = '1234567890';
  for (let itr = 0; itr < count; itr++) {
    const sel = ~~(Math.random() * depth) - 1;
    let fil;
    if (sel >= 0) {
      fil = [];
      for (let jtr = 0; jtr < sel; jtr++) {
        const len = ~~(Math.random() * 9);
        fil.push(baseword.substr(0, len));
      }
    }
    testCases.push(fil);
  }
  return testCases;
}

class FilterArrayContentsRig extends BaseRig {
  constructor(logger) {
    super(
      'Filtering Array Contents via Array.filter vs. Array.forEach vs. For loop /w if-else vs. For-of loop /w if-else',
      count,
      cases,
      depth,
      tests,
      generateTestCases,
      logger
    );
  }
}

module.exports = FilterArrayContentsRig;
