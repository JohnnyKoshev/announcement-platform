import { UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly password: string;
  @IsEnum(UserType)
  readonly userType: UserType;
}
