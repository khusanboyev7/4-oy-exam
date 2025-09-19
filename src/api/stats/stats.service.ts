import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrow } from '../../core/entity/borrow.entity';
import { User } from '../../core/entity/users.entity';
import { Book } from '../../core/entity/book.entity';
import { TopBook, TopUser } from '../../common/interface/stats.interface';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Borrow)
    private readonly borrowRepo: Repository<Borrow>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async topBooks(): Promise<{
    status: number;
    message: string;
    data: TopBook[];
  }> {
    const books = await this.borrowRepo
      .createQueryBuilder('borrow')
      .select('borrow.bookId', 'bookId')
      .addSelect('COUNT(borrow.id)', 'borrowCount')
      .groupBy('borrow.bookId')
      .orderBy('borrowCount', 'DESC')
      .limit(5)
      .getRawMany();

    const result: TopBook[] = [];
    for (const b of books) {
      const book = await this.bookRepo.findOne({ where: { id: b.bookId } });
      result.push({ book, borrowCount: parseInt(b.borrowCount, 10) });
    }

    return { status: 200, message: 'Top 5 borrowed books', data: result };
  }

  async topUsers(): Promise<{
    status: number;
    message: string;
    data: TopUser[];
  }> {
    const users = await this.borrowRepo
      .createQueryBuilder('borrow')
      .select('borrow.userId', 'userId')
      .addSelect('COUNT(borrow.id)', 'borrowCount')
      .groupBy('borrow.userId')
      .orderBy('borrowCount', 'DESC')
      .limit(5)
      .getRawMany();

    const result: TopUser[] = [];
    for (const u of users) {
      const user = await this.userRepo.findOne({ where: { id: u.userId } });
      result.push({ user, borrowCount: parseInt(u.borrowCount, 10) });
    }

    return {
      status: 200,
      message: 'Top 5 users who borrowed most books',
      data: result,
    };
  }
}
