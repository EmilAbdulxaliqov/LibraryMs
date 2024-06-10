import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'book_users' })
export class BookUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.bookUsers)
  user: User;

  @JoinColumn({ name: 'book_id' })
  @ManyToOne(() => Book, (book) => book.bookUsers)
  book: Book;

  @Column({ name: 'librarian_id' })
  librarianId: number;

  @Column({ name: 'due_date' })
  dueDate: Date;
  @Column({ name: 'return_date' })
  returnDate: Date;
}
