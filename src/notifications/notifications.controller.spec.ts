import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { NotificationsController } from './notifications.controller';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'KAFKA_SERVICE',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'notification-test',
                brokers: [`${process.env.KAFKA_HOST}:9092`]
              },
              producerOnlyMode: true,
              consumer: {
                groupId: 'notification-consumer-test'
              }
            }
          }
        ])
      ],
      controllers: [NotificationsController],
      providers: [
        {
          provide: 'KAFKA_PRODUCER',
          useFactory: async (kafkaService: ClientKafka) => {
            return kafkaService.connect();
          },
          inject: ['KAFKA_SERVICE']
        }
      ]
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
