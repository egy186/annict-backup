'use strict';

const cosmiconfig = require('cosmiconfig');
const winston = require('winston');
const { name } = require('../package.json');

const explorer = cosmiconfig(name, { rcExtensions: true });

const loadConfig = async () => {
  const cwd = process.cwd();
  winston.debug(`Current working directory: ${cwd}`);
  try {
    const { config, filepath } = await explorer.load(cwd);
    winston.debug(`Config file path: ${filepath}`);
    return config;
  } catch (err) {
    winston.error('Error while loading config');
    winston.error(err);
    return {};
  }
};

module.exports = loadConfig;
