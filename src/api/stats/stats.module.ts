import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Borrow } from '../../core/entity/borrow.entity';
import { User } from '../../core/entity/users.entity';
import { Book } from '../../core/entity/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrow, User, Book])],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
