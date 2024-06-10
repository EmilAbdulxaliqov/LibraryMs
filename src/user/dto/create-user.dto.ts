import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from 'src/auth/enums/roles';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  username: string;
  @ApiProperty({ example: '1234567', required: false })
  pin?: string;
  @ApiProperty({ example: 'b1234567', required: false })
  studentCardPin?: string;
  @ApiProperty()
  role?: UserRoles;
  @ApiProperty()
  createdById: number;
}
