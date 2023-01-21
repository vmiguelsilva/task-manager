import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';

import { HealthService } from './configurations/health/health.service';

@Controller()
export class AppController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/')
  @HealthCheck()
  checkHealth() {
    return this.healthService.checkHealth();
  }
}
