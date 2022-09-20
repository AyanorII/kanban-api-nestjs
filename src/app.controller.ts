import { Controller, Get } from '@nestjs/common';
import { ApiEndpoints } from './api-endpoints.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  apiEndpoints(): { endpoints: ApiEndpoints } {
    return this.appService.apiEndpoints();
  }
}
