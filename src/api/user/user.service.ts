import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, AccessRoles } from '../../core/entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { Token } from '../../common/token/token'; 
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async register(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      full_name: dto.full_name,
      email: dto.email,
      password: hashed,
      role: (dto.role ?? AccessRoles.READER) as AccessRoles,
      isActive: true,
    });
    await this.userRepo.save(user);
    return { status: 'success', message: 'User registered', data: user };
  }

  async signIn(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = Token.sign({
      id: user.id,
      role: user.role,
      isActive: user.isActive,
    });

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      },
    };
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOneById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: Partial<CreateUserDto>) {
    const user = await this.findOneById(id);
    Object.assign(user, dto);
    return await this.userRepo.save(user);
  }

  async delete(id: string) {
    const user = await this.findOneById(id);
    await this.userRepo.remove(user);
    return { status: 'success', message: 'User deleted' };
  }
}
