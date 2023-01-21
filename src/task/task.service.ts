import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';

import { DatabaseService } from '../configurations/database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TaskService {
  constructor(private readonly databaseService: DatabaseService) {}
  create(createTaskDto: CreateTaskDto) {
    return this.databaseService.task.create({
      data: {
        ...createTaskDto
      }
    });
  }

  async findAll(userId: string) {
    const user = await this.databaseService.user.findUnique({ where: { id: userId } });
    if (user && user.role === Role.MANAGER) {
      return this.databaseService.task.findMany();
    }

    if (!user) {
      throw new Error('User not found, check your userId');
    }
    return this.databaseService.task.findMany({
      where: { userId }
    });
  }

  async remove(taskId: string) {
    const task = await this.databaseService.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException();
    }
    await this.databaseService.task.delete({ where: { id: task.id } });
    return `Task id: ${task.id} has been deleted`;
  }

  async update(taskId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.databaseService.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException();
    }
    const updatedTask = await this.databaseService.task.update({
      where: { id: taskId },
      data: { ...updateTaskDto }
    });
    return updatedTask;
  }
}
