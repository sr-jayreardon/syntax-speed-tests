const testHelpers = require('./testHelpers');
const LogStub = require('logstub');

const defaultOptions = {
  singleCase: false,
  projectionCounts: 100000000,
  projectionGranularity: 'h'
};

/**
 * Extension of the Error class for TestRig specific errors
 * @class TestRigError
 * @extends {Error}
 */
class TestRigError extends Error {
  constructor(...params) {
    super(...params);
  }
}

/**
 * A single instance of a test to run inside a TestRig
 * @class
 * @param name The name of the test to run
 * @param func The test function to run, it should take a single value as a parameter
 * */
class TestRigTest {
  constructor(testname, func) {
    this.testname = testname;
    this.func = func;
  }

  exec(testcase, idx, next) {
    this.func(testcase, idx, next);
  }
}

/**
 * Configure a series of tests to run against the provided test cases
 * @class
 * @param name The name of the Test Rig
 * @param iterations The count of test iterations to perform
 * @param testCases An Array of test cases to run through
 * @param tests An Array of TestRigTest to run the test cases against
 * @param options Optional configuration paramaters for Test Rig
 * */
class TestRig {
  constructor(testname, iterations, testCases, tests, options, logger) {
    if (!testname) {
      throw new TestRigError('TestRig must be instantiated with the `testname` parameter');
    }

    if (!iterations) {
      throw new TestRigError('TestRig must be instantiated with the `iterations` parameter');
    }

    if (!testCases) {
      throw new TestRigError('TestRig must be instantiated with the `testCases` parameter');
    }

    if (!tests) {
      throw new TestRigError('TestRig must be instantiated with the `tests` parameter');
    }

    if (!Array.isArray(tests)) {
      throw new TestRigError('`tests` must be an Array of TestRigTests');
    }

    for (let itr = 0; itr < tests.length; itr++) {
      if (!(tests[itr] instanceof TestRigTest)) {
        throw new TestRigError(`Test ${itr} of ${tests.length} is not an instance of TestRigTests.`);
      }
    }

    this.testname = testname;
    this.options = Object.assign({}, defaultOptions, options);
    this.iterations = iterations;
    this.testCases = testCases;
    this.tests = tests;
    this.caseCount = 1;
    this.statistics = [];
    this.logger = logger || new LogStub();

    if (Array.isArray(testCases)) {
      if (!this.options.singleCase) {
        this.caseCount = testCases.length;
      } else {
        this.testCases = testCases[0];
      }
    } else {
      this.options.singleCase = true;
    }
  }

  getArraySizePadding(array) {
    return (array.length + 1).toString().length + 2;
  }

  getNamePadding(array) {
    let longest = array[0].testname.length;
    if (array.length === 1) {
      return longest;
    }
    for (let idx = 1; idx < array.length; idx++) {
      const len = array[idx].testname.length;
      if (longest < len) {
        longest = len;
      }
    }
    return longest + 1;
  }

  getTestNumberStr(num, padding) {
    return `[${num + 1}]`.padStart(padding, ' ');
  }

  getTestNameStr(testname, padding) {
    return `${testname}:`.padEnd(padding, ' ');
  }

  outputSpeeds(results, tests) {
    this.logger.info('Speeds');
    this.logger.info('======');
    const numPadding = this.getArraySizePadding(results);
    const namePadding = this.getNamePadding(tests);
    for (let itr = 0; itr < results.length; itr++) {
      const numStr = this.getTestNumberStr(itr, numPadding);
      const nameStr = this.getTestNameStr(tests[itr].testname, namePadding);
      this.logger.info(`${numStr} ${nameStr} ${results[itr].speed} ms per op`);
    }
    this.logger.info('');
  }

  outputOps(results, tests) {
    this.logger.info('Ops per Second');
    this.logger.info('==============');
    const numPadding = this.getArraySizePadding(results);
    const namePadding = this.getNamePadding(tests);
    for (let itr = 0; itr < results.length; itr++) {
      const numStr = this.getTestNumberStr(itr, numPadding);
      const nameStr = this.getTestNameStr(tests[itr].testname, namePadding);
      this.logger.info(`${numStr} ${nameStr} ${results[itr].opsPerSec} ops per sec`);
    }
    this.logger.info('');
  }


  outputFastestMethodComparisons(results, tests) {
    this.logger.info('Speed Comparison');
    this.logger.info('================');
    const numPadding = this.getArraySizePadding(results);
    const mainNumStr = this.getTestNumberStr(this.fastestTest, numPadding);
    const fastestTestStr = `${mainNumStr} "${tests[this.fastestTest].testname}"`;
    this.logger.info(`${fastestTestStr} is the fastest syntax.`);
    for (let itr = 0; itr < results.length; itr++) {
      if (itr !== this.fastestTest) {
        const numStr = this.getTestNumberStr(itr, numPadding);
        this.logger.info(`${fastestTestStr} is ${results[itr].relativeSpeed}x faster than ${numStr} "${tests[itr].testname}"`);
      }
    }
    this.logger.info('');
  }

  outputProjection(results, tests) {
    this.logger.info('Projections');
    this.logger.info('===========');
    this.logger.info(`Estimated time to complete ${this.options.projectionCounts} operations`);
    const numPadding = this.getArraySizePadding(results);
    const namePadding = this.getNamePadding(tests);
    for (let itr = 0; itr < results.length; itr++) {
      const numStr = this.getTestNumberStr(itr, numPadding);
      const nameStr = this.getTestNameStr(tests[itr].testname, namePadding).replace(':', '');
      this.logger.info(`Completes ${numStr} ${nameStr} in ${results[itr].projection}`);
    }
    this.logger.info('');
  }

  outputTestResults(results, tests) {
    this.logger.info('');
    this.logger.info('******************');
    this.logger.info('* Results Report *');
    this.logger.info('******************');
    this.logger.info('');
    this.outputSpeeds(results, tests);
    this.outputOps(results, tests);
    this.outputFastestMethodComparisons(results, tests);
    this.outputProjection(results, tests);
  }

  run() {
    this.logger.info(`${this.testname}`);
    this.logger.info(`Running ${this.tests.length} tests with ${this.iterations} operations on ${this.caseCount} cases.`);
    for (let itr = 0; itr < this.tests.length; itr++) {
      this.logger.info(`Running test "${this.tests[itr].testname}"...`);
      const start = Date.now();
      for (let jtr = 0; jtr < this.iterations; jtr++) {
        let value, next;
        let idx = 1;
        if (this.options.singleCase) {
          value = this.testCases;
          next = this.testCases;
        } else {
          const idx2 = (jtr + 1) % this.caseCount;
          idx = jtr % this.caseCount;
          value = this.testCases[idx];
          next = this.testCases[idx2];
        }
        this.tests[itr].exec(value, idx, next);
      }
      const end = Date.now();
      this.statistics[itr] = testHelpers.calcStats(start, end, this.iterations);
      this.statistics[itr].start = start;
      this.statistics[itr].end = end;
    }
    this.fastestTest = testHelpers.fastestTest(this.statistics);
    for (let itr = 0; itr < this.tests.length; itr++) {
      this.statistics[itr].winningTestId = this.fastestTest;
      this.statistics[itr].relativeSpeed = testHelpers.speedDiff(this.statistics[this.fastestTest].opsPerSec, this.statistics[itr].opsPerSec);
      this.statistics[itr].projection = testHelpers.calcProjection(
        this.statistics[itr], 
        this.options.projectionCounts, 
        this.options.projectionGranularity
      );
      this.statistics[itr].rawProjection = this.statistics[itr].speed * this.options.projectionCounts;
    }
    this.outputTestResults(this.statistics, this.tests);
  }
}

module.exports = {
  TestRigError,
  TestRig,
  TestRigTest
};
