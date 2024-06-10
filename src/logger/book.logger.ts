import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logDir = 'src/logs/books';

const infoTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/info-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  level: 'info',
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  level: 'error',
});

const combinedTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/combined-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((info) => {
      const { httpMethod, requestUrl, requestHeaders, requestBody, ...rest } =
        info;
      let message = `${info.timestamp} [${info.level}]: [HTTP ${httpMethod}] ${requestUrl}`;

      if (requestHeaders) {
        message += `\nHeaders: ${JSON.stringify(requestHeaders, null, 2)}`;
      }

      if (requestBody) {
        message += `\nBody: ${JSON.stringify(requestBody, null, 2)}`;
      }

      return message;
    }),
  ),
  defaultMeta: { service: 'book-service' },
  transports: [infoTransport, errorTransport, combinedTransport],
});
