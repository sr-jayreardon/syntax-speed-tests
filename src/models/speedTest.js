class SpeedTest {
  constructor(dbconn, logger) {
    this.dbconn = dbconn;
    this.logger = logger;

    this.model = require('./speedTest.schema')(dbconn);
  }

  findOne(rigId, name) {
    return this.model.findOne({ where: { rigId: rigId, testName: name } });
  }

  findByName(name) {
    return this.model.findOne({ where: { testName: name } });
  }

  findAll(rigId) {
    const options = { where: {} };
    if (rigId) {
      options.where.rigId = rigId;
    }
    return this.model.findAll(options);
  }

  create(rigId, name) {
    return this.model.create({ rigId: rigId, testName: name });
  }

  delete(id) {
    return this.model.destroy({ where: { id: id } });
  }

  count(rigId) {
    const options = { where: {} };
    if (rigId) {
      options.where.rigId = rigId;
    }
    return this.model.count(options);
  }

  countAll() {
    return this.model.count({});
  }
}

module.exports = SpeedTest;
