#!/usr/bin/env node

'use strict';

const annictBackup = require('../lib');
const { formatISO } = require('date-fns');
const { promises: fs } = require('fs');
const logger = require('../lib/logger');
const path = require('path');
const program = require('commander');
const { name, version } = require('../package.json');

program
  .version(version)
  .usage('[options]')
  .option('-f, --force', 'force overwrite')
  .option('-l, --log-level [level]', 'defaults to info')
  .option('-o, --out [path]', 'output file path')
  .option('-p, --pretty', 'pretty JSON output')
  .option('-t, --token [token]', 'personal access token')
  .parse(process.argv);

const options = program.opts();

logger.level = options.logLevel || 'info';

const flag = options.force ? 'w' : 'wx';
const stringify = arg => JSON.stringify(arg, null, options.pretty ? '  ' : '');
const outFile = options.out || `${name}-${formatISO(new Date(), { representation: 'date' })}.json`;
const outDir = path.dirname(outFile);

(async () => {
  try {
    const works = await annictBackup(options.token);
    const backup = stringify(works);
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(outFile, backup, { flag });
  } catch (err) {
    logger.error(err);
    process.exitCode = 1;
  }
})();
