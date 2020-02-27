class RigRun {
  constructor(dbconn, logger) {
    this.dbconn = dbconn;
    this.logger = logger;

    this.model = require('./rigRun.schema')(dbconn);
  }

  findOne(id) {
    return this.model.findOne({ where: { id: id } });
  }

  findAll(rigId) {
    const options = { where: {} };
    if (rigId) {
      options.where.rigId = rigId;
    }
    return this.model.findAll(options);
  }

  create(rigId) {
    return this.model.create({ rigId: rigId });
  }

  delete(id) {
    return this.model.destroy({ where: { id: id } });
  }

  latest(rigId) {
    const options = { limit: 1, order: [['created', 'DESC']], where: {} };
    if (rigId) {
      options.where.rigId = rigId;
    }
    return this.model.findOne(options);
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

module.exports = RigRun;
