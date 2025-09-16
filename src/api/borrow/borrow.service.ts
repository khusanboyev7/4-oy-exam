import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Borrow } from '../../core/entity/borrow.entity';
import { Book } from '../../core/entity/book.entity';
import {
  BookHistory,
  HistoryAction,
} from '../../core/entity/book-history.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private readonly borrowRepository: Repository<Borrow>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(BookHistory)
    private readonly historyRepository: Repository<BookHistory>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateBorrowDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const borrow = queryRunner.manager.create(Borrow, {
        user: { id: dto.userId },
        book: { id: dto.bookId },
        borrowDate: new Date(),
      });
      await queryRunner.manager.save(borrow);

      const history = queryRunner.manager.create(BookHistory, {
        user: { id: dto.userId },
        book: { id: dto.bookId },
        action: HistoryAction.BORROW,
        date: new Date(),
      });
      await queryRunner.manager.save(history);

      await queryRunner.manager.update(
        Book,
        { id: dto.bookId },
        { available: false },
      );

      await queryRunner.commitTransaction();
      return borrow;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async returnBook(id: number, dto: UpdateBorrowDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const borrow = await queryRunner.manager.findOne(Borrow, {
        where: { id },
        relations: ['book', 'user'],
      });

      if (!borrow) {
        throw new NotFoundException('Borrow not found');
      }

      borrow.return_date = new Date();
      await queryRunner.manager.save(borrow);

      const history = queryRunner.manager.create(BookHistory, {
        user: { id: borrow.user.id },
        book: { id: borrow.book.id },
        action: HistoryAction.RETURN,
        date: new Date(),
      });
      await queryRunner.manager.save(history);

      await queryRunner.manager.update(
        Book,
        { id: borrow.book.id },
        { available: true },
      );

      await queryRunner.commitTransaction();
      return borrow;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.borrowRepository.find({ relations: ['user', 'book'] });
  }

  async findOne(id: number) {
    return this.borrowRepository.findOne({
      where: { id },
      relations: ['user', 'book'],
    });
  }

  async update(id: number, dto: UpdateBorrowDto) {
    const borrow = await this.borrowRepository.findOne({ where: { id } });
    if (!borrow) {
      throw new NotFoundException('Borrow not found');
    }
    Object.assign(borrow, dto);
    return this.borrowRepository.save(borrow);
  }

  async remove(id: number) {
    const borrow = await this.borrowRepository.findOne({ where: { id } });
    if (!borrow) {
      throw new NotFoundException('Borrow not found');
    }
    return this.borrowRepository.remove(borrow);
  }
}
