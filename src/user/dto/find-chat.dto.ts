import { IsEmail } from 'class-validator';

export class FindChatDto {
  @IsEmail()
  readonly firstUserEmail: string;
  @IsEmail()
  readonly secondUserEmail: string;
}
