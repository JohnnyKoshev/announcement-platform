import { IsEmail } from 'class-validator';

export class CreateChatDto {
  @IsEmail()
  readonly senderEmail: string;
  @IsEmail()
  readonly recipientEmail: string;
}
