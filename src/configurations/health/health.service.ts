import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthCheckService, HealthIndicator } from '@nestjs/terminus';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(private health: HealthCheckService, private db: DatabaseService) {
    super();
  }

  checkHealth() {
    return this.health.check([() => this.databaseIsHealthy()]);
  }

  async databaseIsHealthy() {
    try {
      await this.db.$queryRaw`SELECT 1`;
      return this.getStatus('Database', true);
    } catch (e) {
      throw new HealthCheckError('Database check failed', e);
    }
  }
}
