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
import { UserService } from './user.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/auth/enums/roles';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('user')
@Controller('user')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth('token')
@SkipThrottle()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('users')
  findAllUser() {
    return this.userService.findAllUser();
  }

  @Get('librarians')
  findAllLibrarians() {
    return this.userService.findAllLibrarians();
  }

  @Get('created-by/:createdById')
  findAllCreatedBy(@Param('createdById') createdById: number) {
    return this.userService.findAllUserCreatedBy(+createdById);
  }

  @Get('reports')
  findAllReports() {
    return this.userService.findAllReports();
  }

  @Roles(UserRoles.USER, UserRoles.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('only-users')
  findAllUsers() {
    return 'Only users can see this';
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('only-admins')
  findAllAdmins() {
    return 'Only admins can see this';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
