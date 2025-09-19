import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Borrow } from './borrow.entity';
import { BookHistory } from './book-history.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ default: 2000 })
  year: number;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => User, { nullable: true })
  addedBy: User;

  @OneToMany(() => Borrow, (borrow) => borrow.book)
  borrows: Borrow[];

  @OneToMany(() => BookHistory, (history) => history.book)
  histories: BookHistory[];

  @CreateDateColumn()
  createdAt: Date;
}
