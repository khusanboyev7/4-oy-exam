import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRoles, User } from '../../core/entity/users.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Token } from '../../common/token/token';
import { IToken } from '../../common/interface/token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async signup(dto: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      full_name: dto.full_name,
      email: dto.email,
      password: hashed,
      role: (dto.role ?? AccessRoles.READER) as AccessRoles,     isActive: true,
    });

    await this.userRepo.save(user);

    return {
      status: 'success',
      message: 'User registered',
      data: { id: user.id, email: user.email, role: user.role },
    };
  }

  async signin(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload: IToken = {
      id: user.id,
      isActive: user.isActive,
      role: user.role,
    };

    const token = Token.sign(payload);

    return {
      status: 'success',
      message: 'Login successful',
      data: { token },
    };
  }
}
