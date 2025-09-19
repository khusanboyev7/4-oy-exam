import { Book } from '../../core/entity/book.entity';
import { User } from '../../core/entity/users.entity';

export interface TopBook {
  book: Book | null;
  borrowCount: number;
}

export interface TopUser {
  user: User | null;
  borrowCount: number;
}
