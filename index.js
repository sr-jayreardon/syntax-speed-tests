#!/usr/bin/env node
/* eslint-disable no-console */
const program = require('commander');
const Sequelize = require('sequelize');
const Winston = require('winston');

const { HSVtoRGB, generateChart } = require('./src/lib/chartHelper.js');
const loadRigs = require('./src/rigs');
const config = require('./config/config');
const pkg = require('./package.json');

const skipTests = [];
const onlyTests = [];
const myFormat = Winston.format.printf(({ level, message }) => {
  return `[${level}] ${message}`;
});
const loggerOptions = {
  level: 'info',
  format: Winston.format.combine(
    Winston.format.colorize(),
    myFormat
  ),
  transports: [new Winston.transports.Console()]
};
let synced = false;
let testRigs, logger, dbconn, models;

function init() {
  if (program.skip) {
    for (const listItem of program.skip.split(',')) {
      skipTests.push(~~(listItem.trim()));
    }
  }

  if (program.only) {
    for (const listItem of program.only.split(',')) {
      onlyTests.push(~~(listItem.trim()));
    }
  }

  if (program.debug) {
    loggerOptions.level = 'debug';
  }

  logger = Winston.createLogger(loggerOptions);
  testRigs = loadRigs(logger);
  const sqlzOptions = Object.assign({}, config);
  sqlzOptions.logging = logger.debug.bind(logger);
  dbconn = new Sequelize(sqlzOptions);
}

function setSync() {
  synced = true;
}

async function initDB() {
  if (!synced) {
    models = await require('./src/models')({ dbconn: dbconn, logger: logger });
    setSync();
  }
}

/**
 * @param {String} rigName
 * @param {Array} tests
 * @param {Array} testResults
 */
async function saveResults(rigName, tests, testResults) {
  await initDB();

  // Get or Create Rig by Name
  let result;
  try {
    result = await models.TestRig.findByName(rigName);
    if (!result) {
      result = await models.TestRig.create(rigName);
    }
  } catch (err) { 
    result = await models.TestRig.create(rigName);
  }
  result = result.dataValues || result; 
  const rigId = result.id;

  // Get RunId
  try {
    result = await models.RigRun.create(rigId);
  } catch (err) { }
  result = result.dataValues || result; 
  const runId = result.id;

  // Get RigTests
  for (let itr = 0; itr < tests.length; itr++) {
    const test = tests[itr];
    try {
      result = await models.SpeedTest.findOne(rigId, test.testname);
      if (!result) {
        result = await models.SpeedTest.create(rigId, test.testname);
      }
    } catch (err) {
      result = await models.SpeedTest.create(rigId, test.testname);
    }
    result = result.dataValues || result;
    const testId = result.id;

    const testResult = testResults[itr];
    const { speed, opsPerSec, winningTestId, relativeSpeed, rawProjection } = testResult;
    try {
      await models.TestResult.create(testId, runId, speed, opsPerSec, winningTestId, relativeSpeed, rawProjection);
    } catch (err) { }
  }
}

function run(tests) {
  init();
  const testToRun = [];
  if (tests || program.all) {
    if (tests) {
      for (const listItem of tests.split(',')) {
        testToRun.push(~~(listItem.trim()));
      }
    }

    let cntr = 0;
    for (const key in testRigs) {
      if (Object.prototype.hasOwnProperty.call(testRigs, key)) {
        if ((program.all || testToRun.includes(cntr)) && !skipTests.includes(cntr)) {
          const rig = testRigs[key];
          rig.run();
          // Pull results and push data into db
          if (!program.nosave) {
            saveResults(rig.rigname, rig.tests, rig.testRig.statistics);
          }
        }
        cntr++;
      }
    }
  }  
}

function list() {
  init();
  let counter = 0;
  let longest = 0;
  for (const key in testRigs) {
    if (Object.prototype.hasOwnProperty.call(testRigs, key)) {
      const len = testRigs[key].rigname.length;
      if (longest < len) {
        longest = len;
      }
    }
  }
  const barStr = ''.padEnd(longest + 8, '=');
  logger.info('');
  logger.info(barStr);
  logger.info(`${'| # | Test Rig Name'.padEnd(longest + 7)}|`);
  logger.info(barStr);
  for (const key in testRigs) {
    if (Object.prototype.hasOwnProperty.call(testRigs, key)) {
      logger.info(`|${counter.toString().padStart(3)}| ${testRigs[key].rigname.padEnd(longest)} |`);
      counter++;
    }
  }
  logger.info(barStr);
  logger.info('');
}

function normalizeORMData(data) {
  if (!data) {
    throw new Error('Bad Data');
  } 
  data = data.dataValues || data;
  return data;
}

function avgArray(arr) {
  return arr.reduce((acc, val) => { return acc + val; }) / arr.length;
}

async function getChartData(rigName) {
  await initDB();

  logger.debug(`Extracting chart data for ${rigName}`);
  let data;
  try {
    data = await models.TestRig.findByName(rigName);
    data = normalizeORMData(data);
  } catch (err) { 
    return undefined;
  }
  const rigId = data.id;
  
  try {
    data = await models.SpeedTest.findAll(rigId);
    data = normalizeORMData(data);
  } catch (err) { 
    return undefined;
  }
  const tests = data.map((val) => { return { id: val.id, name: val.testName }; });

  const testResults = [];
  for (const test of tests) {
    try {
      data = await models.TestResult.findAll(test.id);
      data = normalizeORMData(data);
    } catch (err) {
      return undefined;
    }
    const out = {
      testName: test.name,
      speed: avgArray(data.map((val) => { return val.speed; })),
      opsPerSec: avgArray(data.map((val) => { return val.opsPerSec; })),
      relativeSpeed: avgArray(data.map((val) => { return val.relativeSpeed; })),
      projectedTimeInMs: avgArray(data.map((val) => { return val.projectedTimeInMs; }))
    };
    testResults.push(out);
  }
  return testResults;
}

function getLabels(data) {
  return data.map((val) => { return val.testName; });
}

function getDataSetArray(data, key) {
  return data.map((val) => { return val[key]; });
}

function getDataSet(data, labels) {
  const res = [];
  const len = data.length;
  const offset = 1 / 6 / len;
  for (let jtr = 0; jtr < len; jtr++) {
    const setOffset = offset * jtr;
    const innerData = data[jtr];
    const innerLen = innerData.length;
    const innerOffset = 1 / innerLen;
    const out = [];
    for (let itr = 0; itr < innerLen; itr++) {
      const angle = innerOffset * itr + setOffset;
      const color = HSVtoRGB(angle, 0.9, 0.9);
      const bgColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.75)`;
      const lineColor = `rgba(${color.r}, ${color.g}, ${color.b}, 1.0)`;
      out.push({
        backgroundColor: bgColor,
        borderColor: lineColor,
        data: innerData[itr]
      });
    }
    let label = `${jtr}`;
    if (Array.isArray(labels) && typeof labels[jtr] !== 'undefined') {
      label = labels[jtr];
    }
    const dataset = {
      label: label,
      data: out.map((val) => { return val.data; }),
      backgroundColor: out.map((val) => { return val.backgroundColor; }),
      borderColor: out.map((val) => { return val.borderColor; }),
      borderWidth: 1
    };
    res.push(dataset);
  }
  return res;
}

async function genCharts(tests) {
  init();
  const testToRun = [];
  if (tests || program.all) {
    if (tests) {
      for (const listItem of tests.split(',')) {
        testToRun.push(~~(listItem.trim()));
      }
    }

    let cntr = 0;
    for (const key in testRigs) {
      if (Object.prototype.hasOwnProperty.call(testRigs, key)) {
        if ((program.all || testToRun.includes(cntr)) && !skipTests.includes(cntr)) {
          const rig = testRigs[key];
          const chartData = await getChartData(rig.rigname);
          if (chartData) { 
            const mainLabels = getLabels(chartData);
            const setData = getDataSetArray(chartData, 'relativeSpeed');
            const chartDataSets = getDataSet([setData], ['Relative Speeds']);
            const name = rig.rigname.replace(/ /g, '')
              .replace(/\./g, '-')
              .substring(0, 20)
              .toLowerCase();
            await generateChart(name, rig.rigname, mainLabels, chartDataSets, logger);
          }
        }
        cntr++;
      }
    }
  }   
}

async function genResults(tests) {
  init();
  const testToRun = [];
  if (tests || program.all) {
    if (tests) {
      for (const listItem of tests.split(',')) {
        testToRun.push(~~(listItem.trim()));
      }
    }

    let cntr = 0;
    for (const key in testRigs) {
      if (Object.prototype.hasOwnProperty.call(testRigs, key)) {
        if ((program.all || testToRun.includes(cntr)) && !skipTests.includes(cntr)) {
          const rig = testRigs[key];
          const chartData = await getChartData(rig.rigname);
          if (chartData) { 
            const mainLabels = getLabels(chartData);
            const setData = getDataSetArray(chartData, 'relativeSpeed');
            const chartDataSets = getDataSet([setData], ['Relative Speeds']);
            const name = rig.rigname.replace(/ /g, '')
              .replace(/\./g, '-')
              .substring(0, 20)
              .toLowerCase();
            await generateChart(name, rig.rigname, mainLabels, chartDataSets, logger);
          }
        }
        cntr++;
      }
    }
  }   
}

async function runAll() {
  await init();
  logger.info(`There are ${Object.keys(testRigs).length} test rigs to run...`);
  program.all = true;
  await run();
  await genCharts();
}

function purge() {
  init();
  initDB();
  logger.info('Purging all data from db');
  dbconn.dropAllSchemas({});
  logger.info('OK');
  logger.info('');
}

function stats() {
  init();
  initDB();
}

program
  .version(pkg.version)
  .option('-a, --all', 'Run all tests.')
  .option('-d, --debug', 'Enable debug output.')
  .option('-n, --nosave', 'Do not save test results to database')
  .option('-s, --skip <tests>', 'A comma seperated list of tests to skip by index number.');

program.on('--help', () => {
  console.log('');
  console.log(`  Version: ${pkg.version}`);
});

program
  .command('gen-chart [tests]')
  .description('Generate charts for tests from the current database.')
  .action((tests) => {
    genCharts(tests);
  });  

program
  .command('gen-results [tests]')
  .description('Generate results for tests from current database.')
  .action((tests) => {
    genResults(tests);
  });

program
  .command('list')
  .description('Lists all tests available.')
  .action(() => {
    list();
  });
  
program
  .command('purge')
  .description('Purge all data from tests database')
  .action(() => {
    purge();
  });

program
  .command('run [tests]')
  .description('Run the specified [tests] by index number the comma separated list of tests.')
  .action((tests) => {
    run(tests);
  });

program
  .command('run-all')
  .description('Run all syntax speed tests and then generate graphs')
  .action(() => {
    runAll();
  });  

program
  .command('stats')
  .description('Displays the current database statistics.')
  .action((tests) => {
    stats();
  });  

program.parse(process.argv);

if (process.argv.length < 3) {
  program.help();
}
