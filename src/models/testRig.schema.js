/* eslint-disable new-cap */
const sequelize = require('sequelize');

module.exports = (dbconn) => {
  return dbconn.define(
    'TestRig',
    {
      id: { type: sequelize.INTEGER(11), primaryKey: true, autoIncrement: true },
      rigName: { type: sequelize.STRING(100), allowsNulls: false }
    },
    { timestamps: false, freezeTableName: true }
  );
};
