import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { FindChatDto } from './dto/find-chat.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('chat/messages_count')
  async getMessagesCount(@Req() req) {
    return this.userService.getUserChatsUnreadMessagesCount(req.query.email);
  }

  @Post('create')
  async create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
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
    return this.userService.getChats(body.email);
  }
}
