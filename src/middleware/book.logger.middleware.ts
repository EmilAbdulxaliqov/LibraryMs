import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { logger } from 'src/logger/book.logger';

@Injectable()
export class BookLoggerMiddleware implements NestMiddleware {
  public use(request: Request, response: Response, next: NextFunction): void {
    const { body, method, originalUrl, headers } = request;
    const { statusMessage, statusCode } = response;
    logger.log({
      level: statusCode >= 100 && statusCode < 400 ? 'info' : 'error',
      httpMethod: method,
      requestUrl: originalUrl,
      requestHeaders: headers,
      requestBody: body,
      message: `${statusCode} - ${statusMessage}`,
    });
    next();
  }
}
