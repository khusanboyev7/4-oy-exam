import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Response } from 'express';
import { SignInDto } from 'src/common/dto/signIn.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/infrastucture/decorator/role.decorator';
import { AccessRoles } from 'src/common/enum/roles.enum';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  @Post('signin')
  signIn(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.userService.signIn(dto, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
