import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

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
      providers: [
        NotificationsService,
        {
          provide: 'KAFKA_PRODUCER',
          useFactory: async (kafkaService: ClientKafka) => {
            return kafkaService.connect();
          },
          inject: ['KAFKA_SERVICE']
        }
      ]
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
