import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Book } from './book.entity';

export enum BookHistoryStatus {
  BORROWED = 'borrowed',
  RETURNED = 'returned',
}

@Entity('book_history')
export class BookHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bookHistory, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Book, (book) => book.borrows, { onDelete: 'CASCADE' })
  book: Book;

  @Column({
    type: 'enum',
    enum: BookHistoryStatus,
    default: BookHistoryStatus.BORROWED,
  })
  status: BookHistoryStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrowed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  returned_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
