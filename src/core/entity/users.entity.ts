import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Borrow } from './borrow.entity';
import { BookHistory } from './book-history.entity';

export enum AccessRoles {
  ADMIN = 'admin',
  LIBRARIAN = 'librarian',
  READER = 'reader',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: AccessRoles, default: AccessRoles.READER })
  role: AccessRoles;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Borrow, (borrow) => borrow.user)
  borrows: Borrow[];

  @OneToMany(() => BookHistory, (history) => history.user)
  histories: BookHistory[];
}
