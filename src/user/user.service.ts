import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Chat, Message, User } from '@prisma/client';
import { DATABASE, Database } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async findOne(email: string): Promise<User> {
    const result = await this.db<User>('users')
      .select('*')
      .where('email', email)
      .first();
    return result;
  }

  async create(user: CreateUserDto): Promise<Partial<User>> {
    if (await this.findOne(user.email)) {
      throw new HttpException('User already exists', 409);
    }

    const { password, ...rest } = user;
    console.log(rest);
    const newUser: Partial<User> = {
      ...rest,
      passwordHash: await bcrypt.hash(password, 10),
      registrationDate: new Date(),
    };

    if (await this.db<User>('users').insert(newUser)) {
      const { passwordHash, ...rest } = await this.findOne(user.email);
      return rest;
    }
    throw new HttpException('Error creating user', 500);
  }

  async createMessage(
    message: string,
    senderEmail: string,
    recipientEmail: string,
  ): Promise<Partial<Message>> {
    const sender = await this.findOne(senderEmail);
    const recipient = await this.findOne(recipientEmail);
    if (!sender || !recipient) {
      throw new HttpException('User not found', 404);
    }
    const chat = await this.findChat(sender.email, recipient.email);
    if (!chat) {
      await this.createChat(senderEmail, recipientEmail);
    }
    const newChat = await this.findChat(sender.email, recipient.email);
    const newMessage: Partial<Message> = {
      content: message,
      senderId: sender.id,
      recipientId: recipient.id,
      sentDate: new Date(),
      chatId: newChat.id,
    };
    if (await this.db<Message>('messages').insert(newMessage)) {
      return newMessage;
    }
    throw new HttpException('Error creating message', 500);
  }

  async createChat(
    senderEmail: string,
    recipientEmail: string,
  ): Promise<Partial<Chat>> {
    const sender = await this.findOne(senderEmail);
    const recipient = await this.findOne(recipientEmail);
    if (!sender || !recipient) {
      throw new HttpException('User not found', 404);
    }
    const newChat: Partial<Chat> = {
      firstUserId: sender.id,
      secondUserId: recipient.id,
      creationDate: new Date(),
    };
    if (await this.db<Chat>('chats').insert(newChat)) {
      return newChat;
    }
    throw new HttpException('Error creating chat', 500);
  }

  async findChat(
    firstUserEmail: string,
    secondUserEmail: string,
  ): Promise<Chat> {
    const firstUser = await this.findOne(firstUserEmail);
    const secondUser = await this.findOne(secondUserEmail);
    if (!firstUser || !secondUser) {
      throw new HttpException('User not found', 404);
    }
    const result = await this.db<Chat>('chats')
      .select('*')
      .where('firstUserId', firstUser.id)
      .andWhere('secondUserId', secondUser.id)
      .orWhere('firstUserId', secondUser.id)
      .andWhere('secondUserId', firstUser.id)
      .first();
    return result;
  }

  async getMessages(chatId: number): Promise<Message[]> {
    const result = await this.db<Message>('messages')
      .select('*')
      .where('chatId', chatId);
    return result;
  }

  async getChats(email: string): Promise<Chat[]> {
    const user = await this.findOne(email);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const result = await this.db<Chat>('chats')
      .select('*')
      .where('firstUserId', user.id)
      .orWhere('secondUserId', user.id);
    return result;
  }
}
