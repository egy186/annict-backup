'use strict';

const { cosmiconfig } = require('cosmiconfig');
const logger = require('./logger');
const { name } = require('../package.json');

const explorer = cosmiconfig(name);

const loadConfig = async () => {
  const cwd = process.cwd();
  logger.debug(`Current working directory: ${cwd}`);
  try {
    const result = await explorer.search(cwd);
    if (result === null) {
      throw new Error('No configuration file is found');
    }
    const { config, filepath, isEmpty } = result;
    logger.debug(`Config file path: ${filepath}`);
    if (isEmpty) {
      throw new Error(`${filepath} is empty`);
    }
    return config;
  } catch (err) {
    logger.error('Error while loading config');
    logger.error(err);
    return {};
  }
};

module.exports = loadConfig;
