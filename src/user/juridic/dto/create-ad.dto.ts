import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateAdvertisementDto {
  @IsNumber()
  readonly userId: number;
  @IsString()
  readonly title: string;
  @IsString()
  readonly description: string;
  @IsNumber()
  readonly categoryId: number;
  //   @IsDate()
  //   readonly expirationDate: Date;
}
