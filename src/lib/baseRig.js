const { TestRig, TestRigTest } = require('./testRig');
const LogStub = require('logstub');

class BaseRig {
  constructor(rigname, iterations, caseCount, depth, tests, testCaseFn, logger) {
    this.rigname = rigname || 'Test';
    this.iterations = iterations || 100000000;
    this.caseCount = caseCount || 100000;
    this.depth = depth || 6;
    this.tests = tests || [];
    this.testCaseFn = testCaseFn || (() => { return []; });
    this.areCasesBuilt = false;
    this.isRigBuilt = false;
    this.testCases = null;
    this.testRig = null;
    this.reportGranulatiry = 'h';
    this.logger = logger || new LogStub();
  }

  buildCases(caseCount, depth, testCaseFn) {
    caseCount = caseCount || this.caseCount;
    depth = depth || this.depth;
    testCaseFn = testCaseFn || this.testCaseFn;
    this.logger.info(`Building ${caseCount} test case${caseCount !== 1 ? 's' : ''}...`);
    this.testCases = testCaseFn(caseCount, depth);
    this.areCasesBuilt = true;
  }

  buildRig() {
    if (!this.areCasesBuilt) {
      this.buildCases();
    }
    this.testRig = new TestRig(
      this.rigname,
      this.iterations,
      this.testCases,
      this.tests,
      {
        projectionCounts: 1000 * this.iterations,
        projectionGranularity: this.reportGranulatiry
      },
      this.logger
    );
    this.isRigBuilt = true;
  }

  run() {
    if (!this.isRigBuilt && !this.testRig) {
      this.buildRig();
    }
    this.testRig.run();
  }
}

module.exports = BaseRig;
