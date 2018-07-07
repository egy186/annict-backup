#!/usr/bin/env node

'use strict';

const annictBackup = require('../lib');
const format = require('date-fns/format');
const fs = require('fs');
const logger = require('../lib/logger');
const mkdirp = require('mkdirp');
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

logger.level = program.logLevel || 'info';

const flag = program.force ? 'w' : 'wx';
const stringify = arg => JSON.stringify(arg, null, program.pretty ? '  ' : '');
const outFile = program.out || `${name}-${format(new Date(), 'YYYY-MM-DD')}.json`;
const outDir = path.dirname(outFile);

(async () => {
  try {
    const works = await annictBackup(program.token);
    const backup = stringify(works);
    mkdirp.sync(outDir);
    fs.writeFileSync(outFile, backup, { flag });
  } catch (err) {
    logger.error(err);
    process.exitCode = 1;
  }
})();
