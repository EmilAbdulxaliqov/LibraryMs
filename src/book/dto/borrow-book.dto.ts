import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  bookTitle: string;
  @ApiProperty({ example: '1234567' })
  userPin: string;
  @ApiProperty()
  librarianId: number;
  @ApiProperty({ example: '2022-01-01' })
  returnDate: Date;
}
