import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOfferDto {
  @IsString()
  @IsOptional()
  description: string;
  @IsNumber()
  @IsOptional()
  price: number;
  @IsDate()
  @IsOptional()
  estimatedCompletionDate: Date;
}
