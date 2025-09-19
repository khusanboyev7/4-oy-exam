import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
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

@ApiTags('Stats')
@ApiBearerAuth()
@Controller('stats')
@UseGuards(AuthGuard, RolesGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('top-books')
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Top 5 borrowed books' })
  @ApiResponse({ status: 200, description: 'Top books list' })
  topBooks() {
    return this.statsService.topBooks();
  }

  @Get('top-users')
  @Roles(AccessRoles.ADMIN)
  @ApiOperation({ summary: 'Top 5 users who borrowed most books' })
  @ApiResponse({ status: 200, description: 'Top users list' })
  topUsers() {
    return this.statsService.topUsers();
  }
}
