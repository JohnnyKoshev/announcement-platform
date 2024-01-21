import { IsEmail } from 'class-validator';

export class GetChatDto {
  @IsEmail()
  readonly email: string;
}
