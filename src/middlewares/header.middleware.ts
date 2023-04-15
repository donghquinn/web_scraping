import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { SetErrorResponse } from 'dto/response.dto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  async use(request: Request, response: Response, next: NextFunction) {
    try {
      const authKey = request.headers?.key;
      Logger.debug(request.ip);

      if (authKey === process.env.AUTH_KEY!) {
        next();
      } else {
        return new SetErrorResponse(500, { response: 'No Auth Key Detected' });
      }
    } catch (error) {
      return new SetErrorResponse(500, { response: 'Middleware Error' });
    }
  }
}
