import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsEnum(() => Role)
  role: Role;
}
