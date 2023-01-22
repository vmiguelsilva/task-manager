import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '../configurations/database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        DatabaseService,
        {
          provide: NotificationsService,
          useValue: {
            encodeWithId: jest.fn()
          }
        },
        {
          provide: 'kafka-registrar',
          useValue: {
            emit: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
