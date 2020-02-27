const { TestRig, TestRigTest } = require('./lib/testRig');

const count = 100000000;
const cases = 5000000;

// Creating Test Cases
const testCases = [];
const baseword = '1234567890';
for (let itr = 0; itr < cases; itr++) {
  const sel = ~~(Math.random() * 6) - 1;
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

const rig = new TestRig(count, testCases, tests, { projectionCounts: count * 1000, projectionGranularity: 'h' });

const idx = __filename.lastIndexOf('/') + 1;
if (process.argv[1] && process.argv[1].lastIndexOf(__filename.substring(idx)) !== -1) {
  rig.run();
}
module.exports = rig;
