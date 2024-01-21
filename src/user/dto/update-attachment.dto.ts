import { IsString } from 'class-validator';

export class UpdateAttachmentDto {
  @IsString()
  readonly fileUrl: string;
}
