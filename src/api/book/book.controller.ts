// book.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '../../common/guard/auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../infrastucture/decorator/role.decorator';
import { AccessRoles } from '../../core/entity/users.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Book } from '../../core/entity/book.entity';

@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @Roles(AccessRoles.LIBRARIAN, AccessRoles.ADMIN)
  @ApiOperation({ summary: 'Add a new book' })
  create(@Body() dto: CreateBookDto, @Req() req) {
    const userId = req.user.id; // JWT dan olamiz
    return this.bookService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @Roles(AccessRoles.LIBRARIAN, AccessRoles.ADMIN)
  @ApiOperation({ summary: 'Update book info' })
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  @Delete(':id')
  @Roles(AccessRoles.LIBRARIAN, AccessRoles.ADMIN)
  @ApiOperation({ summary: 'Delete a book' })
  delete(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
