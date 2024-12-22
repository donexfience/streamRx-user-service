import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('secret')
  getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Secret key is not defined in environment variables');
    }

    return secret;
  }
  @Get('algorithm')
  getAlgorithm(): string {
    const secret = process.env.algorithm;
    if (!secret) {
      throw new Error('Secret key is not defined in environment variables');
    }

    return secret;
  }
  
}
