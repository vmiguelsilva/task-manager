import { Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

console.log(`${process.env.KAFKA_HOST}:9092`);

@Module({
  imports: [
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
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async (kafkaService: ClientKafka) => {
        return kafkaService.connect();
      },
      inject: ['KAFKA_SERVICE']
    },
    NotificationsService
  ],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
