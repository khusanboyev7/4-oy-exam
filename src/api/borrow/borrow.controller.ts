import { Controller, Post, Patch, Get, Param, UseGuards } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { AuthGuard } from '../../common/guard/auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../infrastucture/decorator/role.decorator';
import { AccessRoles } from '../../core/entity/users.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Borrow } from '../../core/entity/borrow.entity';

@ApiTags('Borrow')
@ApiBearerAuth()
@Controller('borrow')
@UseGuards(AuthGuard, RolesGuard)
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post(':bookId')
  @Roles(AccessRoles.READER, AccessRoles.LIBRARIAN, AccessRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiParam({
    name: 'bookId',
    required: true,
    description: 'ID of the book to borrow',
  })
  @ApiResponse({
    status: 201,
    description: 'Book borrowed successfully',
    type: Borrow,
  })
  borrowBook(@Param('bookId') bookId: string, @Param('userId') userId: string) {
    return this.borrowService.borrowBook(userId, bookId);
  }

  @Patch(':id/return')
  @Roles(AccessRoles.READER, AccessRoles.LIBRARIAN, AccessRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the borrow record',
  })
  @ApiResponse({
    status: 200,
    description: 'Book returned successfully',
    type: Borrow,
  })
  returnBook(@Param('id') borrowId: string) {
    return this.borrowService.returnBook(borrowId);
  }

  @Get('my')
  @Roles(AccessRoles.READER, AccessRoles.LIBRARIAN, AccessRoles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my borrow records' })
  @ApiResponse({
    status: 200,
    description: 'List of user borrows',
    type: [Borrow],
  })
  myBorrows(@Param('userId') userId: string) {
    return this.borrowService.myBorrows(userId);
  }
}
