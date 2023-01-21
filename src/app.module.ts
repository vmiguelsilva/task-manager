import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationsModule } from './configurations/configurations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, ConfigurationsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
