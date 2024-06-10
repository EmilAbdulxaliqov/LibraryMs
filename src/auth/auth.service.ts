import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/entities/user.entity';
import { TokenTypes } from './enums/token.types';
import { logger } from 'src/logger/user.logger';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    return await this.userService.create(registerDto);
  }

  async login(login: LoginDto) {
    if (!login.pin && !login.studentCardPin) {
      // logger.log({
      //   level: 'error',
      //   message: 'Pin or student card pin is required',
      // });
      throw new BadRequestException('Pin or student card pin is required');
    }
    const user = await this.userService.findOneByPinOrStudentCardPin(
      login.pin || login.studentCardPin,
    );

    if (!user) {
      // logger.log({
      //   level: 'error',
      //   message: `User does not exist with this credentials ${login.pin || login.studentCardPin}`,
      // });
      throw new BadRequestException('User does not exist');
    }

    // logger.log({
    //   level: 'info',
    //   message: `User ${user.username} logged in`,
    // });

    return this.getTokens(user);
  }

  async refresh(refreshToken: string) {
    const { sub, type } = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    if (type !== TokenTypes.REFRESH) {
      // logger.log({
      //   level: 'error',
      //   message: 'Invalid token type',
      // });
      throw new BadRequestException('Invalid token type');
    }

    const user = await this.userService.findOneByPinOrStudentCardPin(sub);

    if (!user) {
      // logger.log({
      //   level: 'error',
      //   message: `User does not exist with this credentials ${sub}`,
      // });
      throw new BadRequestException('User does not exist');
    }

    // logger.log({
    //   level: 'info',
    //   message: `User ${user.username} refreshed token`,
    // });

    return this.getTokens(user);
  }

  async getTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.pin || user.studentCardPin,
          id: user.id,
          username: user.username,
          role: user.role,
          type: TokenTypes.ACCESS,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.pin || user.studentCardPin,
          id: user.id,
          username: user.username,
          role: user.role,
          type: TokenTypes.REFRESH,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
