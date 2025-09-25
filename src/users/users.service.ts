/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { User } from './entities/user.entity';
import { SignupDto } from 'src/auth/dto/signup.dts';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(signupDto: SignupDto) {
    try {
      const { password } = signupDto;
      const salt = parseInt(process.env.SALT || '', 10) || 12;
      const hashedPassword = await bcrypt.hash(password, salt);
      const userData = { ...signupDto, password: hashedPassword };
      return this.userRepository.createUser(userData);
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
