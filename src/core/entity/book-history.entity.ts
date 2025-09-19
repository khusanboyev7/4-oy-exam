import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Book } from './book.entity';

export type BookHistoryAction = 'borrow' | 'return';

@Entity()
export class BookHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book, (book) => book.histories, { onDelete: 'CASCADE' })
  book: Book;

  @ManyToOne(() => User, (user) => user.histories, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: ['borrow', 'return'] })
  action: BookHistoryAction;

  @CreateDateColumn({ name: 'action_date' })
  actionDate: Date;
}
