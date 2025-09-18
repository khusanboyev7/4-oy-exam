import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from 'src/core/entity/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { User } from 'src/core/entity/users.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async create(dto: CreateBookDto, user: User) {
    const book = this.bookRepo.create({ ...dto, addedBy: user });
    await this.bookRepo.save(book);
    return { statusCode: 201, message: 'Book added', data: book };
  }

  async findAll() {
    return this.bookRepo.find({ relations: ['addedBy'] });
  }

  async findOne(id: string) {
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: ['addedBy'],
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    await this.bookRepo.save(book);
    return { statusCode: 200, message: 'Book updated', data: book };
  }

  async delete(id: string) {
    const book = await this.findOne(id);
    await this.bookRepo.remove(book);
    return { statusCode: 200, message: 'Book deleted' };
  }
}
