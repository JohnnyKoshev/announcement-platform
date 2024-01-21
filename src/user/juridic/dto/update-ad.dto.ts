import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAdvertisementDto {
  @IsString()
  @IsOptional()
  readonly title: string;
  @IsString()
  @IsOptional()
  readonly description: string;
  @IsNumber()
  @IsOptional()
  readonly categoryId: number;
  @IsDate()
  @IsOptional()
  readonly expirationDate: Date;
}
