import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  constructor() {}

  use(request: Request, response: Response, next: (error?: any) => void) {
    Logger.log(request.headers);
    Logger.log(request.ip);

    next();
  }
}
