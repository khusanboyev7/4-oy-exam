import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsOptional, IsDateString } from 'class-validator';

export type BookHistoryAction = 'borrow' | 'return';

export class CreateBookHistoryDto {
  @ApiProperty({ description: 'Foydalanuvchi ID', example: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Kitob ID', example: 'uuid' })
  @IsUUID()
  bookId: string;

  @ApiProperty({
    description: 'Holat',
    enum: ['borrow', 'return'],
    example: 'borrow',
    required: false,
  })
  @IsOptional()
  @IsEnum(['borrow', 'return'])
  action?: BookHistoryAction;

  @ApiProperty({
    description: 'Borrow qilingan vaqt',
    example: '2025-09-16T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  borrowedAt?: string;

  @ApiProperty({
    description: 'Return qilingan vaqt',
    example: '2025-09-20T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  returnedAt?: string;
}
