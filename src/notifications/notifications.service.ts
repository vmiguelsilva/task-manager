import { Inject, Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private readonly kafkaProducer: Producer
  ) {}

  async producerTaskNotificationMessage(message: string) {
    await this.kafkaProducer.send({
      topic: 'task-notifications',
      messages: [{ value: message }]
    });
    return 'Message sent';
  }
}
