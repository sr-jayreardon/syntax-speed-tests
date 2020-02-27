const fs = require('fs');
const path = require('path');

const testRigs = {};

/**
 * This iterates through all .js files (except this file) at load time and loads each
 * of them into the `testRigs` object by their name.
 *
 * The `testRigs` are then run in order.
 * ```
 */

module.exports = (logger) => {
  logger.debug('');
  logger.debug('= Loading Rigs =');
  fs.readdirSync(__dirname)
    .filter((file) => { return file.substr(-3) === '.js' && file.indexOf('.') !== 0 && file !== 'index.js'; })
    .forEach((file) => {
      try {
        const ProxyClass = require(path.join(__dirname, file));
        const name = ProxyClass.name;
        logger.debug(`- ${name}`);
        testRigs[name] = new ProxyClass(logger);
      } catch (err) {
        // Prevent load errors from crashing
        logger.error(`Failed loading file: ${file}`);
        logger.error(err);
      }
    });
  return testRigs;
};
