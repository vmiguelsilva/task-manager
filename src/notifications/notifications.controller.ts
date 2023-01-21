import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { Producer } from 'kafkajs';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private kafkaProducer: Producer
  ) {}

  @MessagePattern('task-notifications')
  consumer(@Payload() message: KafkaMessage) {
    console.log(message);
  }
}
