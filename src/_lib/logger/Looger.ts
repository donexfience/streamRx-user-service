import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Incoming Request:', {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
    });
    next();
  }
}
