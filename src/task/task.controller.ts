import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Role, User } from '@prisma/client';

import { Auth } from '../auth/decorators/auth';
import { Roles } from '../auth/decorators/roles';
import { GetUser } from '../users/decorators/get-user';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';

@Controller('task')
@Auth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(Role.TECHNICIAN)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @Roles(Role.MANAGER, Role.TECHNICIAN)
  findAll(@GetUser() user: User) {
    return this.taskService.findAll(user.id);
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.remove(id);
  }

  @Patch()
  @Roles(Role.MANAGER, Role.TECHNICIAN)
  performTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.perform(id);
  }
}
