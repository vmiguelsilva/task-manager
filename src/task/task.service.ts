import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { DatabaseService } from '../configurations/database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';

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
}