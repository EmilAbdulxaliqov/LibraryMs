import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from 'src/auth/enums/roles';
import { logger } from 'src/logger/user.logger';
import { UserStatus } from './enum/user.status';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (
      !createUserDto.pin &&
      !createUserDto.studentCardPin &&
      !createUserDto.username
    ) {
      // logger.log({
      //   level: 'error',
      //   message:
      //     'Bad credentials. Pin, student card pin and username are required',
      // });
      throw new BadRequestException(
        'Bad credentials. Pin, student card pin and username are required',
      );
    }

    const checkForUsername = await this.findOneByUsername(
      createUserDto.username,
    );

    const checkForPinOrStudentCardPin = await this.findOneByPinOrStudentCardPin(
      createUserDto.pin || createUserDto.studentCardPin,
    );

    if (checkForUsername) {
      // logger.log({
      //   level: 'error',
      //   message: `${createUserDto.username} Username already exists`,
      // });
      throw new BadRequestException('Username already exists');
    }

    if (checkForPinOrStudentCardPin) {
      // logger.log({
      //   level: 'error',
      //   message: `${createUserDto.pin || createUserDto.studentCardPin} Pin or student card pin already exists`,
      // });
      throw new BadRequestException('Pin or student card pin already exists');
    }

    this.userRepository.create(createUserDto);
    await this.userRepository.save(createUserDto);
    // logger.log({
    //   level: 'info',
    //   message: JSON.stringify(createUserDto),
    // });
    return createUserDto;
  }

  async findAllLibrarians() {
    const userEntities = await this.userRepository.find({
      where: { role: UserRoles.ADMIN },
    });
    const users = [];
    await Promise.all(
      userEntities.map(async (user) => {
        users.push({
          id: user.id,
          username: user.username,
          pin: user.pin,
          studentCardPin: user.studentCardPin,
          createdAt: user.createdAt,
          role: user.role,
          createdBy: 'SYS_ADMIN',
        });
      }),
    );
    return users;
  }

  async findAllUser() {
    const userEntities = await this.userRepository.find({
      where: { role: UserRoles.USER },
    });
    const users = [];
    await Promise.all(
      userEntities.map(async (user) => {
        const createdBy = await this.userRepository.findOne({
          where: { id: user.createdById },
        });
        users.push({
          id: user.id,
          username: user.username,
          pin: user.pin,
          studentCardPin: user.studentCardPin,
          createdAt: user.createdAt,
          role: user.role,
          createdBy: createdBy?.username,
          status: user.status,
        });
      }),
    );
    return users;
  }

  async findAllUserCreatedBy(createdById: number) {
    return await this.userRepository.find({
      where: { createdById, role: UserRoles.USER },
    });
    // const users = [];
    // usesEntities.forEach((user) => {
    //   users.push({
    //     id: user.id,
    //     username: user.username,
    //     pin: user.pin,
    //     studentCardPin: user.studentCardPin,
    //     createdAt: user.createdAt,
    //     role: user.role,
    //     createdBy: this.findOne(user.createdById),
    //   });
    // });
    // console.log(users);
    // return users;
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneByPinOrStudentCardPin(search: string) {
    if (search.length < 7) {
      // logger.log({
      //   level: 'error',
      //   message: 'Bad credentials',
      // });
      throw new BadRequestException('Bad credentials');
    }
    return await this.userRepository.findOne({
      where: [{ pin: search }, { studentCardPin: search }],
    });
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // const user = await this.userRepository.findOne({
    //   where: [
    //     {
    //       pin,
    //     },
    //     {
    //       studentCardPin: pin,
    //     },
    //   ],
    // });
    // console.log('user:', user);
    // console.log('updateUserDto:', updateUserDto);

    // user.username = updateUserDto.username;
    // await this.userRepository.save(user);
    try {
      await this.userRepository.update(id, updateUserDto);
      // logger.log({
      //   level: 'info',
      //   message: 'Successfully updated user',
      // });
    } catch (error) {
      // logger.log({
      //   level: 'error',
      //   message: 'Error updating user: ' + error,
      // });
    }
    return {
      message: 'Successfully updated user',
    };
  }

  async updateById(user: User) {
    await this.userRepository.update(user.id, user);
  }

  async remove(id: number) {
    try {
      await this.userRepository.delete({ id });
      // logger.log({
      //   level: 'info',
      //   message: 'Successfully deleted user with id: ' + id,
      // });
    } catch (error) {
      // logger.log({
      //   level: 'error',
      //   message: 'Error deleting user: ' + error,
      // });
    }
  }

  async findAllReports() {
    const members = await this.userRepository.find({
      where: { role: UserRoles.USER },
      relations: ['bookUsers', 'bookUsers.book'],
    });

    // const librarians = await this.userRepository.find({
    //   where: { role: UserRoles.ADMIN },
    // });

    // const blockedMembers = await this.userRepository.find({
    //   where: { status: UserStatus.BLOCKED, role: UserRoles.USER },
    // });

    // const borrowedBooks = members.map((member) => {
    //   return member.bookUsers.filter((bookUser) => bookUser. === false);
    // })

    // const result = { members, librarians, blockedMembers };

    return members;
  }
}
