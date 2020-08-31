import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(
      ({ level, message, timestamp }) =>
        `${timestamp} ${level}: ${message}`,
    ),
  ),

  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      silent: process.env.NODE_ENV === 'test',
    }),
    new winston.transports.File({
      filename: 'combined.log',
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
});

if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'test'
) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
