import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logDir = 'src/logs/users';

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
      const {
        httpMethod,
        requestUrl,
        requestHeaders,
        requestBody,
        message,
        responseBody,
        ...rest
      } = info;

      console.log('info:', info);
      let winstonMessage = `${info.timestamp} [${info.level}]:[REQ] [HTTP ${httpMethod}] ${requestUrl}`;

      // if (requestHeaders) {
      //   winstonMessage += `\nHeaders: ${JSON.stringify(requestHeaders, null, 2)}`;
      // }

      if (requestBody) {
        winstonMessage += `\nRequest Body: ${JSON.stringify(requestBody, null, 2)}`;
      }

      if (message) {
        winstonMessage += `\n${message}`;
      }

      if (responseBody) {
        winstonMessage += `\nResponse Body: ${JSON.stringify(responseBody, null, 2)}`;
      }

      console.log('Message dsljkfkldsjfjkld:', message);
      return winstonMessage;
    }),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [infoTransport, errorTransport, combinedTransport],
});
