import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';

@ApiTags('Borrow')
@Controller('borrows')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  create(@Body() dto: CreateBorrowDto) {
    return this.borrowService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.borrowService.findOne(id);
  }

  @Get()
  findAll() {
    return this.borrowService.findAll();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBorrowDto) {
    return this.borrowService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.borrowService.remove(+id);
  }
}
