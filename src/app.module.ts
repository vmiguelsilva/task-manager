import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationsModule } from './configurations/configurations.module';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, ConfigurationsModule, TaskModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
