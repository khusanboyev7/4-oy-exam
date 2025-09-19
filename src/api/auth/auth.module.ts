import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Token } from 'src/common/token/token';

import { CryptoService } from 'src/common/bcrypt/Crypto';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AuthService, Token, CryptoService],
  exports: [AuthService],
})
export class AuthModule {}
