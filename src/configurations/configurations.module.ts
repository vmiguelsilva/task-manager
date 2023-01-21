import { Global, Module } from '@nestjs/common';

import { DatabaseService } from './database/database.service';
import { HealthService } from './health/health.service';

@Global()
@Module({
  providers: [DatabaseService, HealthService],
  exports: [DatabaseService, HealthService]
})
export class ConfigurationsModule {}
