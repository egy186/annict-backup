import { loadConfig } from './load-config.js';
import { logger } from './logger.js';
import { works } from './works.js';

const annictBackup = async personalAccessToken => {
  const token = personalAccessToken || (await loadConfig()).token;
  logger.debug('Fetching data');
  const data = await works(token);
  logger.info(`Fetched ${data?.viewer?.works?.nodes?.length} work(s)`);
  return data;
};

export { annictBackup };

export default annictBackup;
