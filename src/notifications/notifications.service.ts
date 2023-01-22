import { Inject, Injectable } from '@nestjs/common';
import { Role, Task } from '@prisma/client';
import { Producer } from 'kafkajs';

import { DatabaseService } from '../configurations/database/database.service';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private readonly kafkaProducer: Producer,
    private readonly databaseService: DatabaseService
  ) {}

  async producerTaskNotificationMessage(message: string) {
    await this.kafkaProducer.send({
      topic: 'task-notifications',
      messages: [{ value: message }]
    });
    return 'Message sent';
  }

  async notifyAllManagers(task: Task) {
    const managers = await this.databaseService.user.findMany({
      where: { role: Role.MANAGER }
    });

    // Used for of because it enable await syntax
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of managers) {
      await this.producerTaskNotificationMessage(
        `The tech "${task.userId}" performed the task "${
          task.id
        }" on date ${task.performedAt?.toLocaleString()}`
      );
    }
  }
}
