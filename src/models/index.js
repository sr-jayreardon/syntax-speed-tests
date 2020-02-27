const fs = require('fs');
const path = require('path');

const models = {};

module.exports = async(params) => {
  params.logger.debug('');
  params.logger.debug('= Loading Models =');
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.substr(-3) === '.js' &&
        file.substr(-10) !== '.schema.js' &&
        file !== 'index.js' &&
        file.indexOf('.') !== 0
      );
    })
    .forEach((file) => {
      const fullpath = path.join(__dirname, file);
      const ProxyClass = require(fullpath);
      const name = ProxyClass.name;
      params.logger.debug(`- ${name}`);
      models[ProxyClass.name] = new ProxyClass(params.dbconn);
    });

  params.logger.debug('');
  params.logger.debug('= Syncing Models =');
  await params.dbconn.sync();
  return models;
};
