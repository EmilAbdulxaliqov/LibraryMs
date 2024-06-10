import { UserRoles } from 'src/auth/enums/roles';
import { BookUsers } from 'src/book/entities/book-users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStatus } from '../enum/user.status';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column({ nullable: true, length: 7 })
  pin: string;
  @Column({ name: 'student_card_pin', nullable: true })
  studentCardPin: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;
  @Column({ name: 'created_by_id' })
  createdById: number;
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;
  // @ManyToMany(() => Book, (book) => book.users)
  // books: Book[];
  @OneToMany(() => BookUsers, (bookUsers) => bookUsers.user)
  bookUsers: BookUsers[];
}
