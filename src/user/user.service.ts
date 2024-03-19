import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {

    try{
      const hashedPassword = await hash(user.password, 10);
      const newUser = this.usersRepository.create({
        username: user.username,
        password: hashedPassword,
      });
      return this.usersRepository.save(newUser);
    } catch (error) {
        throw error;
      }

  }

  async login(username: string, password: string): Promise<string> {
    try {
      const user = await this.usersRepository.findOne({ where: { username } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      const token = sign({ username: user.username }, process.env.JWT_KEY, { expiresIn: '24h' });
      return token;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }

}
