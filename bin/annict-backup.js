#!/usr/bin/env node

'use strict';

const annictBackup = require('../lib');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const program = require('commander');
const winston = require('winston');
const { name, version } = require('../package.json');

const getYyyyMmDd = () => {
  const fillZero = num => num.toString().padStart(2, '0');
  const now = new Date();
  return [
    now.getFullYear(),
    fillZero(now.getMonth() + 1),
    fillZero(now.getDate())
  ].join('-');
};

program
  .version(version)
  .usage('[options]')
  .option('-f, --force', 'force overwrite')
  .option('-l, --log-level [level]', 'defaults to info')
  .option('-o, --out [path]', 'output file path')
  .option('-p, --pretty', 'pretty JSON output')
  .option('-t, --token [token]', 'personal access token')
  .parse(process.argv);

winston.level = program.logLevel || 'info';

const flag = program.force ? 'w' : 'wx';
const stringify = arg => JSON.stringify(arg, null, program.pretty ? '  ' : '');
const outFile = program.out || `${name}-${getYyyyMmDd()}.json`;
const outDir = path.dirname(outFile);

(async () => {
  try {
    const works = await annictBackup(program.token);
    const backup = stringify(works);
    mkdirp.sync(outDir);
    fs.writeFileSync(outFile, backup, { flag });
  } catch (err) {
    winston.error(err);
    process.exitCode = 1;
  }
})();
