/* eslint-disable no-useless-catch */
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
      throw error;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      return this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  findByEmail(email: string): Promise<User | null> {
    try {
      return this.userRepository.findByEmail(email);
    } catch (error) {
      throw error;
    }
  }
}
