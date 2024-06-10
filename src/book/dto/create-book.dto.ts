import { ApiProperty } from '@nestjs/swagger';
import { Genres } from '../enums/genres';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  title: string;
  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  author: string;
  @ApiProperty({ example: 'A story of the American Dream' })
  description: string;
  @ApiProperty({ example: 5 })
  copies: number;
  @ApiProperty({ example: 5 })
  avaliableCopies: number;
  @ApiProperty({ example: Genres.Fiction })
  genre: Genres;
}
