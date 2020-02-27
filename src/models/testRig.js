class TestRig {
  constructor(dbconn, logger) {
    this.dbconn = dbconn;
    this.logger = logger;

    this.model = require('./testRig.schema')(dbconn);
  }

  findByName(name) {
    return this.model.findOne({ where: { rigName: name } });
  }

  create(name) {
    return this.model.create({ rigName: name });
  }

  count() {
    return this.model.count({});
  }
}
module.exports = TestRig;
