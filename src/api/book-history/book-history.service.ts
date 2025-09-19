import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookHistory } from 'src/core/entity/book-history.entity';
import {
  CreateBookHistoryDto,
  BookHistoryAction,
} from './dto/create-book-history.dto';
import { UpdateBookHistoryDto } from './dto/update-book-history.dto';
import { Book } from 'src/core/entity/book.entity';
import { User } from 'src/core/entity/users.entity';

@Injectable()
export class BookHistoryService {
  constructor(
    @InjectRepository(BookHistory)
    private readonly bookHistoryRepo: Repository<BookHistory>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async create(dto: CreateBookHistoryDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const book = await this.bookRepo.findOne({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const bookHistory = this.bookHistoryRepo.create({
      user,
      book,
      action: dto.action ?? 'borrow',
      actionDate: dto.borrowedAt ? new Date(dto.borrowedAt) : new Date(),
    });

    return await this.bookHistoryRepo.save(bookHistory);
  }

  async findAll() {
    return await this.bookHistoryRepo.find({
      relations: ['user', 'book'],
      order: { actionDate: 'DESC' },
    });
  }

  async findOne(id: string) {
    const bookHistory = await this.bookHistoryRepo.findOne({
      where: { id },
      relations: ['user', 'book'],
    });
    if (!bookHistory)
      throw new NotFoundException(`BookHistory with ID ${id} not found`);
    return bookHistory;
  }

  async update(id: string, dto: UpdateBookHistoryDto) {
    const bookHistory = await this.findOne(id);

    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');
      bookHistory.user = user;
    }

    if (dto.bookId) {
      const book = await this.bookRepo.findOne({ where: { id: dto.bookId } });
      if (!book) throw new NotFoundException('Book not found');
      bookHistory.book = book;
    }

    if (dto.action) bookHistory.action = dto.action as BookHistoryAction;
    if (dto.borrowedAt) bookHistory.actionDate = new Date(dto.borrowedAt);

    return await this.bookHistoryRepo.save(bookHistory);
  }

  async remove(id: string) {
    const bookHistory = await this.findOne(id);
    await this.bookHistoryRepo.remove(bookHistory);
    return { message: 'Book history deleted successfully' };
  }
}
