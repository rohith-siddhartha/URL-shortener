import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get')
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @Get('set')
  async setHello(): Promise<void> {
    return await this.appService.setHello();
  }

}
