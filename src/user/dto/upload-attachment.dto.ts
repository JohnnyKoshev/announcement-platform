import { AttachmentType } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UploadAttachmentDto {
  @IsNumber()
  readonly userId: number;
  @IsNumber()
  @IsOptional()
  readonly advertisementId: number;
  @IsNumber()
  @IsOptional()
  readonly offerId: number;
  @IsEnum(AttachmentType)
  readonly attachmentType: AttachmentType;
  @IsDate()
  @IsOptional()
  readonly uploadDate: Date;
}
