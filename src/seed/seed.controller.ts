import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private seedService: SeedService) {}

  @Post()
  async seed(): Promise<void> {
    await this.seedService.seed();
  }

  @Post('/drop')
  async drop(): Promise<void> {
    await this.seedService.drop();
  }
}
