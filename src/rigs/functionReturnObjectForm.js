const { TestRigTest } = require('../lib/testRig');
const BaseRig = require('../lib/baseRig');

const count = 1000000000;
const cases = 1;
const depth = 1;

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

class FunctionReturnObjectFormRig extends BaseRig {
  constructor(logger) {
    super(
      'Function Return Object From via Short-Form vs. Long-Form vs. Mixed-Form vs. Object.assign vs. Spread Operator',
      count,
      cases,
      depth,
      tests,
      () => {
        return {
          a: 12,
          b: 3.14159265358979,
          c: 'test',
          d: true,
          e: null
        };
      },
      logger
    );
  }
}

module.exports = FunctionReturnObjectFormRig;
