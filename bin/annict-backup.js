#!/usr/bin/env node

import { annictBackup } from '../lib/index.js';
import { formatISO } from 'date-fns';
import fs from 'node:fs/promises';
import { logger } from '../lib/logger.js';
import path from 'node:path';
import pkg from '../lib/pkg.js';
import program from 'commander';

program
  .version(pkg.version)
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
const outFile = options.out || `${pkg.name}-${formatISO(new Date(), { representation: 'date' })}.json`;
const outDir = path.dirname(outFile);

try {
  const works = await annictBackup(options.token);
  const backup = stringify(works);
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outFile, backup, { flag });
} catch (err) {
  logger.error(err);
  process.exitCode = 1;
}
