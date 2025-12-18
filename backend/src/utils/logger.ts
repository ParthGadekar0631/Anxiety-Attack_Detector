import morgan from 'morgan';
import { createLogger, format, transports } from 'winston';
import { env } from '../config/env';

const { combine, timestamp, printf, colorize } = format;

export const logger = createLogger({
  level: env.LOG_LEVEL,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ level, message, timestamp: ts }) => `${ts} [${level}]: ${message}`)
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf(({ level, message, timestamp: ts }) => `${ts} [${level}]: ${message}`)),
    }),
  ],
});

export const httpLogger = morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
});
