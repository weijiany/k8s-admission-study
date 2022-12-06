import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/mutate')
  @HttpCode(200)
  getHello(@Body() body: Record<any, string>): string {
    console.log(JSON.stringify(body));
    return this.appService.getHello();
  }
}
