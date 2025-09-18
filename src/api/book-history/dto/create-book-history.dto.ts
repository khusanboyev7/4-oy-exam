import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { BookHistoryStatus } from 'src/core/entity/book-history.entity';

export class CreateBookHistoryDto {
  @ApiProperty({ description: 'Foydalanuvchi ID', example: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Kitob ID', example: 'uuid' })
  @IsUUID()
  bookId: string;

  @ApiProperty({
    description: 'Holat',
    enum: BookHistoryStatus,
    example: 'borrowed',
    required: false,
  })
  @IsOptional()
  @IsEnum(BookHistoryStatus)
  status?: BookHistoryStatus;

  @ApiProperty({
    description: 'Borrow qilingan vaqt',
    example: '2025-09-16T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  borrowed_at?: Date;

  @ApiProperty({
    description: 'Return qilingan vaqt',
    example: '2025-09-20T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  returned_at?: Date;
}
