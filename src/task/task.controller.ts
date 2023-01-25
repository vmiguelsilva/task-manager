import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

import { Auth } from '../auth/decorators/auth';
import { Roles } from '../auth/decorators/roles';
import { GetUser } from '../users/decorators/get-user';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';

@ApiTags('task')
@ApiBearerAuth()
@Controller('task')
@Auth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.TECHNICIAN)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @HttpCode(200)
  @Roles(Role.MANAGER, Role.TECHNICIAN)
  findAll(@GetUser() user: User) {
    return this.taskService.findAll(user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.MANAGER)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.remove(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles(Role.MANAGER, Role.TECHNICIAN)
  performTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.perform(id);
  }
}
