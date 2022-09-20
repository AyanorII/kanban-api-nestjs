import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiEndpoints } from './api-endpoints.interface';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  apiEndpoints(): { endpoints: ApiEndpoints } {
    const API_URL = this.configService.get('API_URL');

    return {
      endpoints: {
        boards: `${API_URL}/boards`,
        columns: `${API_URL}/columns`,
        tasks: `${API_URL}/tasks`,
        subtasks: `${API_URL}/subtasks`,
      },
    };
  }
}
