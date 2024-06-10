import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiProperty,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RefreshToken } from './dto/refresh.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  // @UseGuards(RefreshTokenGuard)
  // @Get('refresh')
  // async refresh(@Req() req: Request) {
  //   const refreshToken = req.headers['authorization'].split(' ')[1];
  //   const rt = req.user['refreshToken'];
  //   console.log(refreshToken);
  //   console.log('rt', rt);
  //   return await this.authService.refresh(refreshToken);
  // }
  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: RefreshToken) {
    return await this.authService.refresh(refreshToken.refreshToken);
  }
}
