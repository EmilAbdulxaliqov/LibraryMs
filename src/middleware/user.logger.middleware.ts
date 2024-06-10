import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as http from 'http';
import { logger } from 'src/logger/user.logger';

@Injectable()
export class UserLoggerMiddleware implements NestMiddleware {
  public use(request: Request, response: Response, next: NextFunction): void {
    const { body, method, originalUrl, headers } = request;
    // const { statusMessage, statusCode } = response;
    console.log('Request:', request.body);
    // console.log('Response:', response.statusMessage);
    // logger.log({
    //   level: statusCode >= 100 && statusCode < 400 ? 'info' : 'error',
    //   httpMethod: method,
    //   requestUrl: originalUrl,
    //   requestHeaders: headers,
    //   requestBody: body,
    //   message: `${statusCode} - ${statusMessage}`,
    // });

    let oldWrite = response.write;
    let oldEnd = response.end;
    let chunks = [];
    response.write = function (chunk: any) {
      chunks.push(chunk);
      return oldWrite.apply(response, arguments);
    };
    response.end = function (chunk: any) {
      if (chunk) {
        chunks.push(chunk);
      }
      return oldEnd.apply(response, arguments);
    };

    response.on('finish', () => {
      const { statusCode, statusMessage } = response;
      const responseBody = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      console.log('Response status code:', statusCode);
      console.log('Response body:', responseBody);
      logger.log({
        level: statusCode >= 100 && statusCode < 400 ? 'info' : 'error',
        httpMethod: method,
        requestUrl: originalUrl,
        requestBody: body,
        message: `[RES] ${statusCode} - ${statusMessage}`,
        responseBody,
      });
    });

    next();
  }
}
