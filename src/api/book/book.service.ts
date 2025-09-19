// book.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../../core/entity/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { User } from '../../core/entity/users.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateBookDto, userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const book = this.bookRepo.create({ ...dto, addedBy: user });
    return await this.bookRepo.save(book);
  }

  async findAll() {
    return this.bookRepo.find({ relations: ['addedBy'] });
  }

  async findOne(id: string) {
    const book = await this.bookRepo.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    return await this.bookRepo.save(book);
  }

  async delete(id: string) {
    const book = await this.findOne(id);
    await this.bookRepo.remove(book);
    return { message: 'Book deleted successfully' };
  }
}
