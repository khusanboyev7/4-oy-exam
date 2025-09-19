import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from 'src/core/entity/borrow.entity';
import { Book } from 'src/core/entity/book.entity';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { BookHistory } from 'src/core/entity/book-history.entity';
import { UserModule } from '../user/user.module'; 
import { BookModule } from '../book/book.module'; 
import { BookHistoryModule } from '../book-history/book-history.module'; 
import { User } from '../../core/entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrow, Book, BookHistory, User]),
  ],
  providers: [BorrowService],
  controllers: [BorrowController],
  exports: [BorrowService],
})
export class BorrowModule {}
