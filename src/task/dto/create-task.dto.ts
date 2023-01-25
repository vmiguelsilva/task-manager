import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(2500)
  summary: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ type: Date })
  @IsDate()
  performedAt: Date | null;
}
