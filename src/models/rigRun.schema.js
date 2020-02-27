/* eslint-disable new-cap */
const sequelize = require('sequelize');

module.exports = (dbconn) => {
  return dbconn.define(
    'RigRun',
    {
      id: { type: sequelize.INTEGER(11), primaryKey: true, autoIncrement: true },
      rigId: { type: sequelize.INTEGER(11), allowsNulls: false }
    },
    { timestamps: true, freezeTableName: true }
  );
};
