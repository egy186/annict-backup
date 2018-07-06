'use strict';

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.simple()
  ),
  transports: [new transports.Console()]
});

module.exports = logger;
