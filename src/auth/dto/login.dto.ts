import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '1234567', required: false })
  pin?: string;
  @ApiProperty({ example: 'b1234567', required: false })
  studentCardPin?: string;
}
