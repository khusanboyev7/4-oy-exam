import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/core/entity/book.entity';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { User } from '../../core/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, User])],
  providers: [BookService],
  controllers: [BookController],
  exports: [BookService],
})
export class BookModule {}
