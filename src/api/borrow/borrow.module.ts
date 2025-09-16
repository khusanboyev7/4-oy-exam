import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from 'src/core/entity/borrow.entity';
import { Book } from 'src/core/entity/book.entity';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { BookHistory } from '../../core/entity/book-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrow, Book, BookHistory])],
  providers: [BorrowService],
  controllers: [BorrowController],
  exports: [BorrowService],
})
export class BorrowModule {}
