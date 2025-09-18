import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/core/entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoService } from 'src/common/bcrypt/Crypto';
import { TokenService } from 'src/common/token/token';
import { SignInDto } from 'src/common/dto/signIn.dto';
import { Response } from 'express';
import { getSuccessRes } from 'src/common/util/get-succes-res';
import { IToken } from 'src/common/interface/token.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: CreateUserDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await this.crypto.encrypt(dto.password);
    const user = this.userRepo.create({ ...dto, password: hashed });
    await this.userRepo.save(user);
    return getSuccessRes(user, 201);
  }

  async signIn(dto: SignInDto, res: Response) {
    const user = await this.userRepo.findOne({
      where: { email: dto.username },
    });
    if (!user) throw new BadRequestException('User not found');

    const match = await this.crypto.decrypt(dto.password, user.password);
    if (!match) throw new BadRequestException('Invalid password');

    const payload: IToken = {
      id: user.id,
      isActive: user.isActive,
      role: user.role,
    };
    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);

    await this.tokenService.writeCookie(res, 'userToken', refreshToken, 15);
    return getSuccessRes({ token: accessToken });
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findOneById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOneById(id);
    if (dto.password) user.password = await this.crypto.encrypt(dto.password);
    Object.assign(user, dto);
    await this.userRepo.save(user);
    return getSuccessRes(user);
  }

  async delete(id: string) {
    const user = await this.findOneById(id);
    await this.userRepo.remove(user);
    return getSuccessRes({ message: 'User deleted' });
  }
}
