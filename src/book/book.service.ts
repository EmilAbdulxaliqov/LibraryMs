import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { UserService } from 'src/user/user.service';
import { BookUsers } from './entities/book-users.entity';
import { ReturnBookDto } from './dto/return-book.dto';
import { Genres } from './enums/genres';
import { logger } from 'src/logger/book.logger';
import { logger as userLogger } from 'src/logger/user.logger';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(BookUsers)
    private bookUsersRepository: Repository<BookUsers>,
    private userService: UserService,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const bookExists = await this.bookRepository.findOne({
      where: { title: createBookDto.title },
    });
    if (bookExists) {
      // logger.log({
      //   level: 'error',
      //   message: `Book with title ${createBookDto.title} already exists`,
      // });
      throw new BadRequestException(
        `Book with title ${createBookDto.title} already exists`,
      );
    }
    const book = this.bookRepository.create(createBookDto);
    await this.bookRepository.save(book);
    // logger.log({
    //   level: 'info',
    //   message: JSON.stringify(createBookDto),
    // });
    return {
      message: 'Successfully created book',
    };
  }

  async findAll() {
    return await this.bookRepository.find();
  }

  async findOneById(id: number) {
    return await this.bookRepository.findOne({ where: { id } });
  }

  async findOneByTitle(title: string) {
    return await this.bookRepository.findOne({ where: { title } });
  }

  async update(title: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({ where: { title } });
    if (!book) {
      // logger.log({
      //   level: 'error',
      //   message: `Book with title ${title} not found`,
      // });
      throw new NotFoundException(`Book with title ${title} not found`);
    }
    await this.bookRepository.update({ title }, updateBookDto);
    // logger.log({
    //   level: 'info',
    //   message: 'Successfully updated book',
    // });
    return {
      message: 'Successfully updated book',
    };
  }

  async updateById(id: number, updateBookDto: UpdateBookDto) {
    await this.bookRepository.update(id, updateBookDto);
    // logger.log({
    //   level: 'info',
    //   message: 'Successfully updated book',
    // });
    return {
      message: 'Successfully updated book',
    };
  }

  async remove(title: string) {
    // const book = await this.bookRepository.findOne({ where: { title } });
    // if (!book) {
    //   throw new NotFoundException(`Book with title ${title} not found`);
    // }
    await this.bookRepository.delete({ title });
    // logger.log({
    //   level: 'info',
    //   message: 'Successfully deleted book with title: ' + title,
    // });
    return 'Successfully deleted book';
  }

  async removeById(id: number) {
    try {
      await this.bookRepository.delete(id);
      // logger.log({
      //   level: 'info',
      //   message: 'Successfully deleted book with id: ' + id,
      // });
    } catch (error) {
      // logger.log({
      //   level: 'error',
      //   message: 'Error deleting book: ' + error,
      // });
    }
    return {
      message: 'Successfully deleted book',
    };
  }

  async borrowBook(borrowBookDto: BorrowBookDto) {
    const user = await this.userService.findOneByPinOrStudentCardPin(
      borrowBookDto.userPin,
    );
    const book = await this.findOneByTitle(borrowBookDto.bookTitle);

    if (!user) {
      // userLogger.log({
      //   level: 'error',
      //   message: `User with pin ${borrowBookDto.userPin} not found`,
      // });
      throw new NotFoundException(
        `User with pin ${borrowBookDto.userPin} not found`,
      );
    }
    if (!book) {
      // logger.log({
      //   level: 'error',
      //   message: `Book with title ${borrowBookDto.bookTitle} not found`,
      // });
      throw new NotFoundException(
        `Book with title ${borrowBookDto.bookTitle} not found`,
      );
    }

    if (book.availableCopies === 0) {
      throw new BadRequestException('Book is not available');
    }

    const bookUser = await this.bookUsersRepository.findOne({
      where: {
        book: { title: borrowBookDto.bookTitle },
        user: [
          { pin: borrowBookDto.userPin },
          { studentCardPin: borrowBookDto.userPin },
        ],
      },
    });

    if (bookUser) {
      // logger.log({
      //   level: 'error',
      //   message: 'Book already borrowed by user',
      // });
      throw new BadRequestException('Book already borrowed by user');
    }

    await this.bookUsersRepository.save({
      user,
      book,
      librarianId: borrowBookDto.librarianId,
      dueDate: new Date(),
      returnDate: borrowBookDto.returnDate,
    });

    book.availableCopies--;

    await this.userService.updateById(user);
    await this.bookRepository.update(book.id, book);
    // logger.log({
    //   level: 'info',
    //   message: 'Successfully borrowed book',
    // });
    return {
      message: 'Successfully borrowed book',
    };
  }

  async returnBook(returnBookDto: ReturnBookDto) {
    const bookUser = await this.bookUsersRepository.findOne({
      where: {
        book: { title: returnBookDto.bookTitle },
        user: [
          { pin: returnBookDto.userPin },
          { studentCardPin: returnBookDto.userPin },
        ],
      },
      relations: ['book', 'user'],
    });

    if (!bookUser) {
      // logger.log({
      //   level: 'error',
      //   message: 'Book not found in user borrowed books',
      // });
      throw new NotFoundException('Book not found in user borrowed books');
    }

    const book = await this.bookRepository.findOne({
      where: { title: returnBookDto.bookTitle },
    });

    book.availableCopies++;

    await this.bookRepository.update({ title: returnBookDto.bookTitle }, book);
    await this.bookUsersRepository.delete({ id: bookUser.id });
    // logger.log({
    //   level: 'info',
    //   message: 'Successfully returned book',
    // });
    return {
      message: 'Successfully returned book',
    };
  }

  async findUserBorrowedBooks(id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      // userLogger.log({
      //   level: 'error',
      //   message: `User with id ${id} not found`,
      // });
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const bookUsers = await this.bookUsersRepository.find({
      where: { user },
      relations: ['book', 'user'],
    });
    return bookUsers;
  }

  async findAllBorrowedBooks() {
    const bookUsers = [];
    const bookUsersEntity = await this.bookUsersRepository.find({
      relations: ['book', 'user'],
    });
    await Promise.all(
      bookUsersEntity.map(async (bookUser) => {
        const librarian = await this.userService.findOne(bookUser.librarianId);
        bookUsers.push({
          book: bookUser.book,
          user: bookUser.user,
          librarianName: librarian.username,
          dueDate: bookUser.dueDate,
          returnDate: bookUser.returnDate,
        });
      }),
    );
    return bookUsers;
  }

  getAllGenres() {
    return Genres;
  }
}
