import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  adId: number;
  @IsNumber()
  userId: number;
  @IsString()
  description: string;
  @IsNumber()
  price: number;
  @IsDate()
  @IsOptional()
  estimatedCompletionDate: Date;
}
