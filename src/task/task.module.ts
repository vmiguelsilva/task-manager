import { Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';

import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationsService } from '../notifications/notifications.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    NotificationsModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification',
            brokers: [`${process.env.KAFKA_HOST}:9092`]
          },
          producerOnlyMode: true,
          consumer: {
            groupId: 'notification-consumer'
          }
        }
      }
    ])
  ],
  controllers: [TaskController],
  providers: [
    TaskService,
    NotificationsService,
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async (kafkaService: ClientKafka) => {
        return kafkaService.connect();
      },
      inject: ['KAFKA_SERVICE']
    }
  ]
})
export class TaskModule {}
