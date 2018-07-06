'use strict';

const MeWork = require('./me-work');
const loadConfig = require('./load-config');
const logger = require('./logger');

const annictBackup = async personalAccessToken => {
  const token = personalAccessToken || (await loadConfig()).token;
  const meWork = new MeWork(token);
  const pager = async function* () {
    let page = 1;
    while (page) {
      logger.debug(`Fetching page ${page}`);
      // eslint-disable-next-line no-await-in-loop
      const { next_page: nextPage, total_count: totalCount, works } = await meWork.get(page);
      if (page === 1) {
        logger.info(`Found ${totalCount} works`);
      }
      logger.info(`Fetched works ${Math.min(page * meWork.perPage, totalCount)}/${totalCount}`);
      page = nextPage;
      yield works;
    }
  };

  const mergedWorks = [];
  for await (const works of pager()) {
    mergedWorks.push(...works);
  }
  return mergedWorks;
};

module.exports = annictBackup;
