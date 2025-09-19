import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrow } from '../../core/entity/borrow.entity';
import { User } from '../../core/entity/users.entity';
import { Book } from '../../core/entity/book.entity';
import { BookHistory } from '../../core/entity/book-history.entity';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow) private readonly borrowRepo: Repository<Borrow>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(BookHistory)
    private readonly historyRepo: Repository<BookHistory>,
    private readonly dataSource: DataSource,
  ) {}

  async borrowBook(userId: string, bookId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['borrows'],
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.borrows.length >= 3)
      throw new BadRequestException('Maximum 3 books allowed');

    const book = await this.bookRepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');
    if (!book.available) throw new BadRequestException('Book not available');

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    return await this.dataSource.transaction(async (manager) => {
      const borrow = manager.create(Borrow, { user, book, due_date: dueDate });
      await manager.save(Borrow, borrow);

      book.available = false;
      await manager.save(Book, book);

      const history = manager.create(BookHistory, {
        user,
        book,
        action: 'borrow',
      });
      await manager.save(BookHistory, history);

      return borrow;
    });
  }

  async returnBook(borrowId: string) {
    const borrow = await this.borrowRepo.findOne({
      where: { id: borrowId },
      relations: ['book', 'user'],
    });
    if (!borrow) throw new NotFoundException('Borrow record not found');

    if (borrow.return_date)
      throw new BadRequestException('Book already returned');

    const now = new Date();
    borrow.return_date = now;
    borrow.overdue = borrow.due_date < now;

    return await this.dataSource.transaction(async (manager) => {
      await manager.save(Borrow, borrow);

      const book = borrow.book;
      book.available = true;
      await manager.save(Book, book);

      const history = manager.create(BookHistory, {
        user: borrow.user,
        book: book,
        action: 'return',
      });
      await manager.save(BookHistory, history);

      return borrow;
    });
  }

  async myBorrows(userId: string) {
    return await this.borrowRepo.find({
      where: { user: { id: userId } },
      relations: ['book'],
    });
  }
}
