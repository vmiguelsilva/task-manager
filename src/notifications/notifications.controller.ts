import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';

@Controller('notifications')
export class NotificationsController {
  @MessagePattern('task-notifications')
  consumer(@Payload() message: KafkaMessage) {
    console.log(message);
  }
}
