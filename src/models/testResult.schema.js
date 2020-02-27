/* eslint-disable new-cap */
const sequelize = require('sequelize');

module.exports = (dbconn) => {
  return dbconn.define(
    'TestResult',
    {
      id: { type: sequelize.INTEGER(11), primaryKey: true, autoIncrement: true },
      testId: { type: sequelize.INTEGER(11), allowsNulls: false },
      runId: { type: sequelize.INTEGER(11), allowsNulls: false },
      speed: { type: sequelize.FLOAT, allowsNulls: false },
      opsPerSec: { type: sequelize.FLOAT, allowsNulls: false },
      winningTestId: { type: sequelize.INTEGER(11), allowsNulls: false },
      relativeSpeed: { type: sequelize.FLOAT, allowsNulls: false },
      projectedTimeInMs: { type: sequelize.INTEGER(11), allowsNulls: false }
    },
    { timestamps: true, freezeTableName: true }
  );
};
