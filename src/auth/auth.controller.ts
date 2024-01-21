import { Controller, Request, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<any> {
    const user = await this.authService.register(body);
    return { user };
  }
}
