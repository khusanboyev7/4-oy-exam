import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/infrastucture/decorator/role.decorator';
import  { AccessRoles } from 'src/common/enum/roles.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBARY)
  @Post()
  create(@Body() dto: CreateBookDto, @Req() req: any) {
    return this.bookService.create(dto, req.user);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBARY)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBARY)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
