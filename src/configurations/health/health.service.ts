import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthCheckService,
  HealthIndicator,
  HttpHealthIndicator
} from '@nestjs/terminus';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: DatabaseService
  ) {
    super();
  }

  checkHealth() {
    return this.health.check([
      // () => this.http.pingCheck('Sword', 'https://swordhealth.com'),
      () => this.databaseIsHealthy()
    ]);
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
