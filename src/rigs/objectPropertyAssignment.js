const { TestRigTest } = require('../lib/testRig');
const BaseRig = require('../lib/baseRig');

const count = 1000000000;
const cases = 1;
const depth = 1;

const tests = [];
tests.push(new TestRigTest('object destructuring', (testCase, idx) => {
  const { a, b, c, d, e } = testCase;
}));

tests.push(new TestRigTest('scope (.) and assignment (=) operators', (testCase, idx) => {
  const a = testCase.a;
  const b = testCase.b;
  const c = testCase.c;
  const d = testCase.d;
  const e = testCase.e;
}));

class ObjectPropertyAssignmentRig extends BaseRig {
  constructor(logger) {
    super(
      'Object Propetry Retrieval via Object Destructuring vs. Object Scope Operator',
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

module.exports = ObjectPropertyAssignmentRig;
