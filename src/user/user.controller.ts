import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Post,
  Req,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
  UploadedFile,
  Delete,
  Patch,
  Param,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { FindChatDto } from './dto/find-chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import type { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('chat/messages_count')
  async getMessagesCount(@Req() req) {
    return this.userService.getUserChatsUnreadMessagesCount(req.query.email);
  }

  @Post('create')
  async create(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Get('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('message/create')
  async createMessage(@Body() body: CreateMessageDto) {
    return this.userService.createMessage(
      body.message,
      body.senderEmail,
      body.recipientEmail,
    );
  }

  @Post('chat/find')
  async findChat(@Body() body: FindChatDto) {
    return this.userService.findChat(body.firstUserEmail, body.secondUserEmail);
  }

  @Post('chat/create')
  async createChat(@Body() body: CreateChatDto) {
    return this.userService.createChat(body.senderEmail, body.recipientEmail);
  }

  @Post('chat/all')
  async getChats(@Body() body: GetChatDto) {
    return this.userService.getChatsByEmail(body.email);
  }

  @Post('attachment/upload')
  @UseInterceptors(FileInterceptor('file'))
  async createAttachment(
    @Body() body,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 32 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.createAttachment(body, file);
  }

  @Patch('attachment/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateAttachment(
    @Param('id') id: string,
    @Body() body: UpdateAttachmentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 32 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.updateAttachment(Number(id), body, file);
  }

  @Delete('attachment/:id')
  async deleteAttachment(@Req() req) {
    return this.userService.deleteAttachment(Number(req.params.id));
  }

  @Get('attachment/:id')
  async getAttachment(@Req() req) {
    return this.userService.getAttachmentById(Number(req.params.id));
  }

  @Get('attachment/download/:id')
  getFile(@Res({ passthrough: true }) res: Response, @Param('id') id: string) {
    return this.userService.downloadAttachment(Number(id), res);
  }

  @Get('attachment/all')
  async getAllAttachments() {
    return this.userService.getAllAttachments();
  }

  @Get('attachment')
  async getAttachments(@Req() req) {
    return this.userService.getAttachmentsByUserId(Number(req.query.id));
  }
}
