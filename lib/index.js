'use strict';

const Bluebird = require('bluebird');
const MeWork = require('./me-work');
const loadConfig = require('./load-config');
const winston = require('winston');
const { range } = require('lodash');

const annictBackup = async personalAccessToken => {
  const token = personalAccessToken || (await loadConfig()).token;
  const meWork = new MeWork(token);
  const mergedWorks = [];

  // Fetch first page to get total count
  winston.debug('Fetching first page');
  const result = await meWork.get(1);
  const totalCount = result.total_count;
  winston.info(`Found ${totalCount} work(s)`);
  mergedWorks.push(...result.works);
  const pages = Math.ceil(totalCount / meWork.perPage);
  winston.info(`Fetched page 1 of ${pages}`);

  // Fetch next page if required
  if (pages > 1) {
    const pagesRange = range(2, pages + 1);
    await Bluebird.each(pagesRange, async page => {
      winston.debug(`Fetching page ${page} of ${pages}`);
      const { works } = await meWork.get(page);
      mergedWorks.push(...works);
      winston.info(`Fetched page ${page} of ${pages}`);
    });
  }
  return mergedWorks;
};

module.exports = annictBackup;
