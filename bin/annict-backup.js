#!/usr/bin/env node

import { Command } from 'commander/esm.mjs';
import { annictBackup } from '../lib/index.js';
import fs from 'node:fs/promises';
import { logger } from '../lib/logger.js';
import path from 'node:path';
import pkg from '../lib/pkg.js';

const program = new Command();

program
  .version(pkg.version)
  .option('-f, --force', 'force overwrite')
  .option('-l, --log-level <level>', 'log level', 'info')
  .option('-o, --out <file>', 'output file path')
  .option('-p, --pretty', 'pretty JSON output')
  .option('-t, --token <token>', 'personal access token')
  .action(async options => {
    logger.level = options.logLevel;
    const stringify = arg => JSON.stringify(arg, null, options.pretty ? '  ' : '');
    const outFile = options.out || `${pkg.name}-${new Date().toISOString().split('T')[0]}.json`;

    try {
      const works = await annictBackup(options.token);
      const backup = stringify(works);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, backup, { flag: options.force ? 'w' : 'wx' });
    } catch (err) {
      logger.error(err);
      process.exitCode = 1;
    }
  });

program.parse();
