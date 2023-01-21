import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationsModule } from './configurations/configurations.module';
import { HealthService } from './configurations/health/health.service';

describe('AppController', () => {
  let appController: AppController;
  let healthService: HealthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationsModule],
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    appController = app.get<AppController>(AppController);
    healthService = app.get<HealthService>(HealthService);
  });

  describe('root', () => {
    it('call the correct method', async () => {
      healthService.checkHealth = jest.fn().mockReturnValue('return value');
      await appController.checkHealth();
      expect(healthService.checkHealth).toHaveBeenCalled();
    });
  });
});
