import { Global, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { DatabaseService } from './database/database.service';
import { HealthService } from './health/health.service';

@Global()
@Module({
  imports: [TerminusModule],
  providers: [DatabaseService, HealthService],
  exports: [DatabaseService, HealthService]
})
export class ConfigurationsModule {}
