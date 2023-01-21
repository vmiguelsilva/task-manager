import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';

import { mockTask } from '../../test/mocks';
import { DatabaseService } from '../configurations/database/database.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, DatabaseService]
    }).compile();

    service = module.get<TaskService>(TaskService);
    databaseService = module.get<DatabaseService>(DatabaseService);
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

    jest.spyOn(databaseService.task, 'findMany').mockResolvedValue([task]);
    jest
      .spyOn(databaseService.user, 'findUnique')
      .mockResolvedValueOnce({ role: Role.MANAGER } as User);

    const tasks = await service.findAll(task.userId);

    expect(tasks[0].title).toBe(task.title);
    expect(tasks[0].userId).toBe(task.userId);
    expect(tasks[0].summary).toBe(task.summary);
  });
});
