import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Borrow } from './borrow.entity';
import { BookHistory } from './book-history.entity';
import { AccessRoles } from 'src/common/enum/roles.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  full_name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'enum', enum: AccessRoles, default: AccessRoles.READER })
  role: AccessRoles;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Borrow, (borrow) => borrow.user)
  borrows: Borrow[];

  @OneToMany(() => BookHistory, (history) => history.user)
  bookHistory: BookHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
