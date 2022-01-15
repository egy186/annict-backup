import winston from 'winston';

const { createLogger, format, transports } = winston;

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.simple()
  ),
  transports: [new transports.Console()]
});

export { logger };

export default logger;
