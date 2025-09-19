import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookHistory } from 'src/core/entity/book-history.entity';
import { BookHistoryService } from './book-history.service';
import { BookHistoryController } from './book-history.controller';
import { UserModule } from '../user/user.module';
import { BookModule } from '../book/book.module';
import { Book } from '../../core/entity/book.entity';
import { User } from '../../core/entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookHistory, Book, User])
  ],
  providers: [BookHistoryService],
  controllers: [BookHistoryController],
  exports: [BookHistoryService],
})
export class BookHistoryModule {}
