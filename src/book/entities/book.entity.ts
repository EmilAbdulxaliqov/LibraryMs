import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genres } from '../enums/genres';
import { BookUsers } from './book-users.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    unique: true,
  })
  title: string;
  @Column()
  author: string;
  @Column()
  description: string;
  @Column({
    type: 'enum',
    enum: Genres,
  })
  genre: Genres;
  @Column()
  copies: number;
  @Column()
  availableCopies: number;
  //   @ManyToMany(() => User, (user) => user.books)
  //   @JoinTable({
  //     name: 'book_users',
  //     joinColumn: {
  //       name: 'book_id',
  //       referencedColumnName: 'id',
  //     },
  //     inverseJoinColumn: {
  //       name: 'user_id',
  //       referencedColumnName: 'id',
  //     },
  //   })
  //   users: User[];
  @OneToMany(() => BookUsers, (bookUsers) => bookUsers.book)
  bookUsers: BookUsers[];
}
