import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Book } from './book.entity';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.borrows, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Book, (book) => book.borrows, { onDelete: 'CASCADE' })
  book: Book;

  @CreateDateColumn()
  borrow_date: Date;

  @Column()
  due_date: Date;

  @Column({ nullable: true })
  return_date: Date;

  @Column({ default: false })
  overdue: boolean;
}
