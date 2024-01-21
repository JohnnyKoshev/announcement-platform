import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    const { passwordHash, ...result } = user;
    if (user && (await bcrypt.compare(pass, passwordHash))) {
      return result;
    }
    return null;
  }

  async login(user) {
    const userDb = await this.userService.findOne(user.email);
    if (!userDb) {
      throw new UnauthorizedException();
    }
    console.log(user);
    const payload = { email: user.email, sub: userDb.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(body): Promise<Partial<User>> {
    return await this.userService.createUser(body);
  }
}
