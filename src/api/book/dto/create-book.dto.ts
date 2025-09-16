import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Atomic Habits' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'James Clear' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  year: number;
}
