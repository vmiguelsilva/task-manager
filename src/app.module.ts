import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [ConfigurationsModule, TaskModule, AuthModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
