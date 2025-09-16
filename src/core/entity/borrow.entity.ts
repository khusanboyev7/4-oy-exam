import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Book } from './book.entity';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  bookId: number;

  @ManyToOne(() => User, (user) => user.borrows, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, (book) => book.borrows, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrow_date: Date;

  @Column({ type: 'timestamp' })
  due_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  return_date: Date;

  @Column({ default: false })
  overdue: boolean;
}
