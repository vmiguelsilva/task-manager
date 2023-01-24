import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';

import { mockTask } from '../../test/mocks';
import { DatabaseService } from '../configurations/database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let databaseService: DatabaseService;
  let notificationsService: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        TaskService,
        DatabaseService,
        {
          provide: NotificationsService,
          useValue: {
            encodeWithId: jest.fn(),
            notifyAllManagers: jest.fn()
          }
        },
        {
          provide: 'kafka-registrar',
          useValue: {
            emit: jest.fn(),
            notifyAllManagers: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<TaskService>(TaskService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('return the Task created .create', async () => {
    const task = mockTask();

    jest.spyOn(databaseService.task, 'create').mockResolvedValueOnce({
      ...task
    });

    const newTask = await service.create({ ...task });
    expect(newTask.title).toEqual(task.title);
    expect(newTask.summary).toEqual(task.summary);
    expect(newTask.performedAt).toBeNull();
    expect(newTask.userId).toEqual(task.userId);
  });

  it('return some tasks .findAll', async () => {
    const task = mockTask();

    jest.spyOn(databaseService.task, 'findMany').mockResolvedValue([task]);
    jest.spyOn(databaseService.user, 'findUnique').mockResolvedValueOnce({} as User);

    const tasks = await service.findAll(task.userId);

    expect(tasks[0].title).toBe(task.title);
    expect(tasks[0].userId).toBe(task.userId);
    expect(tasks[0].summary).toBe(task.summary);
  });

  it('return error if userId is invalid .findAll', async () => {
    const task = mockTask();

    jest.spyOn(databaseService.user, 'findUnique').mockResolvedValueOnce(null);

    const promise = service.findAll(task.userId);

    await expect(promise).rejects.toThrow();
  });

  it('return all task if user is a Manager .findAll', async () => {
    const task = mockTask();

    jest.spyOn(databaseService.task, 'findMany').mockResolvedValueOnce([task]);
    jest
      .spyOn(databaseService.user, 'findUnique')
      .mockResolvedValueOnce({ role: Role.MANAGER } as User);

    const tasks = await service.findAll(task.userId);

    expect(tasks[0].title).toBe(task.title);
    expect(tasks[0].userId).toBe(task.userId);
    expect(tasks[0].summary).toBe(task.summary);
  });

  it('delete task by id .remove', async () => {
    const task = mockTask();

    jest.spyOn(databaseService.task, 'findUnique').mockResolvedValueOnce(task);
    const deleteTaskMock = jest
      .spyOn(databaseService.task, 'delete')
      .mockResolvedValueOnce({ ...task });

    await service.remove(task.id);

    expect(deleteTaskMock).toHaveBeenCalled();
  });

  it("receive not found error if taskId doesn't found .remove", () => {
    const task = mockTask();

    jest.spyOn(databaseService.task, 'findUnique').mockResolvedValueOnce(null);

    const promise = service.remove(task.id);

    expect(promise).rejects.toThrowError();
  });

  it('update a task .update', async () => {
    const task = mockTask();

    const taskUpdated = {
      ...task,
      performedAt: new Date()
    };

    jest.spyOn(databaseService.task, 'findUnique').mockResolvedValueOnce(task);
    jest.spyOn(databaseService.task, 'update').mockResolvedValueOnce({
      ...taskUpdated
    });
    const result = await service.update(task.id, taskUpdated);
    expect(result.title).toEqual(task.title);
    expect(result.performedAt).toBe(taskUpdated.performedAt);
    expect(result.performedAt).not.toEqual(task.performedAt);
  });

  it("receive not found error if taskId doesn't found  .update", () => {
    const task = mockTask();

    const taskUpdated = {
      ...task,
      performedAt: new Date()
    };

    jest.spyOn(databaseService.task, 'findUnique').mockResolvedValueOnce(null);

    const promise = service.update(task.id, taskUpdated);
    expect(promise).rejects.toThrowError();
  });

  it('perform task .perform', async () => {
    const task = mockTask();

    const taskUpdated = {
      ...task,
      performedAt: new Date()
    };

    jest.spyOn(databaseService.task, 'findUnique').mockResolvedValueOnce(task);
    jest.spyOn(databaseService.task, 'update').mockResolvedValueOnce({
      ...taskUpdated
    });

    await service.perform(task.id);

    expect(notificationsService.notifyAllManagers).toHaveBeenCalled();
  });
});
