import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/configurations/database/database.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}
  create(createUserDto: CreateUserDto) {
    return this.db.user.create({
      data: {
        ...createUserDto
      }
    });
  }

  findOne(id: string) {
    return this.db.user.findUnique({
      where: { id }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.db.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`User not found, please check the userId ${id}`);
    }

    return this.db.user.update({
      where: { id },
      data: updateUserDto
    });
  }
}
