import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: (error?: any) => void) {
    // Logger.debug(request.headers);
    Logger.debug(request.ip);

    next();
  }
}
