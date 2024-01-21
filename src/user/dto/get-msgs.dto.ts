import { IsNumber } from 'class-validator';

export class GetMessageDto {
  @IsNumber()
  readonly chatId: number;
}
