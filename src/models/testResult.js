class TestResult {
  constructor(dbconn, logger) {
    this.dbconn = dbconn;
    this.logger = logger;

    this.model = require('./testResult.schema')(dbconn);
  }

  findById(id) {
    return this.model.findOne({ where: { id: id } });
  }

  findAll(testId, limit) {
    const options = { order: [['createdAt', 'DESC']], where: {} };
    if (testId) {
      options.where.testId = testId;
    }
    options.limit = limit || 20;
    return this.model.findAll(options);
  }

  create(testId, runId, speed, opsPerSec, winningTestId, relativeSpeed, projectedTimeInMs) {
    return this.model.create({ 
      testId,
      runId,
      speed,
      opsPerSec,
      winningTestId,
      relativeSpeed,
      projectedTimeInMs     
    });
  }

  delete(id) {
    return this.model.destroy({ where: { id: id } });
  }

  count(testId) {
    return this.model.count({ where: { testId: testId } });
  }

  countAll() {
    return this.model.count({});
  }
}

module.exports = TestResult;
