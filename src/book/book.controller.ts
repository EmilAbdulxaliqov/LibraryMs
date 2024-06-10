import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('book')
@Controller('book')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth('token')
@SkipThrottle()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  // @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get('borrowed')
  getBorrowedBooks() {
    return this.bookService.findAllBorrowedBooks();
  }

  @Get('borrowed/:id')
  getBorrowedBooksByUserId(@Param('id') id: number) {
    return this.bookService.findUserBorrowedBooks(id);
  }

  @Get('genre')
  getAllGenres() {
    return Object.values(this.bookService.getAllGenres());
  }

  @Get(':title')
  findOne(@Param('title') title: string) {
    return this.bookService.findOneByTitle(title);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateById(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookService.removeById(+id);
  }

  @Post('borrow')
  borrow(@Body() borrowBookDto: BorrowBookDto) {
    return this.bookService.borrowBook(borrowBookDto);
  }

  @Post('return')
  return(@Body() returnBookDto: ReturnBookDto) {
    return this.bookService.returnBook(returnBookDto);
  }
}
