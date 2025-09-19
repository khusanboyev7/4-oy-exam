import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config/index';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../api/user/user.module';
import { BookModule } from '../api/book/book.module';
import { BookHistoryModule } from '../api/book-history/book-history.module';
import { BorrowModule } from '../api/borrow/borrow.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: String(config.DB_URI),
      autoLoadEntities: true,
      synchronize: false,
    }),

    JwtModule.register({
      global: true,
    }),

    CacheModule.register({
      isGlobal: true,
    }),

    UserModule,
    BookModule,
    BookHistoryModule,
    BorrowModule,
    StatsModule,
  ],
})
export class AppModule {}
