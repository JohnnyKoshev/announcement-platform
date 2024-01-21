import { IsEmail, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsEmail()
  readonly senderEmail: string;
  @IsEmail()
  readonly recipientEmail: string;
  @IsString()
  readonly message: string;
}
