import { ApiProperty } from '@nestjs/swagger';

export class ReturnBookDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  bookTitle: string;
  @ApiProperty({ example: '1234567' })
  userPin: string;
  @ApiProperty()
  librarianId?: number;
}
