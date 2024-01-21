import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { GetMessageDto } from './dto/get-msgs.dto';
import { FindChatDto } from './dto/find-chat.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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

  @Post('chat/messages')
  async getMessages(@Body() body: GetMessageDto) {
    return this.userService.getMessages(body.chatId);
  }

  @Post('chat/all')
  async getChats(@Body() body: GetChatDto) {
    return this.userService.getChats(body.email);
  }
}
