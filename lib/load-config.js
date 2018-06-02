'use strict';

const cosmiconfig = require('cosmiconfig');
const winston = require('winston');
const { name } = require('../package.json');

const explorer = cosmiconfig(name);

const loadConfig = async () => {
  const cwd = process.cwd();
  winston.debug(`Current working directory: ${cwd}`);
  try {
    const result = await explorer.search(cwd);
    if (result === null) {
      throw new Error('No configuration file is found');
    }
    const { config, filepath, isEmpty } = result;
    winston.debug(`Config file path: ${filepath}`);
    if (isEmpty) {
      throw new Error(`${filepath} is empty`);
    }
    return config;
  } catch (err) {
    winston.error('Error while loading config');
    winston.error(err);
    return {};
  }
};

module.exports = loadConfig;
