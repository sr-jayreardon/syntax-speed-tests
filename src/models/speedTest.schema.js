/* eslint-disable new-cap */
const sequelize = require('sequelize');

module.exports = (dbconn) => {
  return dbconn.define(
    'SpeedTest',
    {
      id: { type: sequelize.INTEGER(11), primaryKey: true, autoIncrement: true },
      rigId: { type: sequelize.INTEGER(11), allowsNulls: false },
      testName: { type: sequelize.STRING(100), allowsNulls: false }
    },
    { timestamps: false, freezeTableName: true }
  );
};
