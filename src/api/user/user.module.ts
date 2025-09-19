import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core/entity/users.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CryptoService } from 'src/common/bcrypt/Crypto';
import { Token } from 'src/common/token/token';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, CryptoService, Token],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
