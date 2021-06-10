'use strict';

const loadConfig = require('./load-config');
const logger = require('./logger');
const works = require('./works');

const annictBackup = async personalAccessToken => {
  const token = personalAccessToken || (await loadConfig()).token;
  logger.debug('Fetching data');
  const data = await works(token);
  logger.info(`Fetched ${data?.viewer?.works?.nodes?.length} work(s)`);
  return data;
};

module.exports = annictBackup;
