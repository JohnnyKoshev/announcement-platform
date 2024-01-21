import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import {
  Attachment,
  AttachmentType,
  Chat,
  Message,
  User,
} from '@prisma/client';
import type { Response } from 'express';
import { DATABASE, Database } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

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

  async createUser(user: CreateUserDto): Promise<Partial<User>> {
    if (await this.findOne(user.email)) {
      throw new HttpException('User already exists', 409);
    }

    const { password, ...rest } = user;
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
      firstUserEmail: sender.email,
      secondUserEmail: recipient.email,
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
    if (!result) {
      return null;
    }
    const messages = await this.getMessages(result.id);
    const chatWithMessages = {
      ...result,
      messages,
    };
    return chatWithMessages;
  }

  async getMessages(chatId: number): Promise<Message[]> {
    await this.setMessagesRead(chatId);
    const result = await this.db<Message>('messages')
      .select('*')
      .where('chatId', chatId);
    return result;
  }

  async setMessagesRead(chatId: number): Promise<void> {
    await this.db<Message>('messages')
      .update({ isRead: true })
      .where('chatId', chatId);
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

  async getUserChatsUnreadMessagesCount(email: string): Promise<number[]> {
    if (!email) throw new HttpException('Email not provided', 400);
    const user = await this.findOne(email);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const chats = await this.getChats(email);
    const result = [];
    for (const chat of chats) {
      const count = await this.db<Message>('messages')
        .count('id')
        .where('chatId', chat.id)
        .andWhere('recipientId', user.id)
        .andWhere('isRead', false)
        .first();
      result.push({
        chatId: chat.id,
        recipientEmail: email,
        senderEmail:
          chat.firstUserEmail === email
            ? chat.secondUserEmail
            : chat.firstUserEmail,
        unreadMessagesCount: count.count,
      });
    }
    return result;
  }

  async createAttachment(body, file: Express.Multer.File) {
    if (!body.advertisementId && !body.offerId)
      throw new HttpException('Advertisement or offer id not provided', 400);
    const filesDir = path.join(__dirname, '../../src', 'files');
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir);
    }
    const extension = '.' + file.mimetype.split('/')[1];
    const uniqueFilename = uuidv4() + extension;
    const filePath = path.join(filesDir, uniqueFilename);
    fs.writeFileSync(filePath, file.buffer);

    const newAttachment = {
      fileUrl: filePath,
      advertisementId: body.advertisementId ? body.advertisementId : null,
      offerId: body.offerId ? body.offerId : null,
      attachmentType: body.attachmentType,
      uploadDate: new Date(),
      userId: body.userId,
    };
    const newAttachmentId = await this.db<Attachment>('attachments')
      .insert(newAttachment)
      .returning('id');
    console.log(newAttachmentId);
    const checkedAttachment = await this.db<Attachment>('attachments')
      .select('*')
      .where('id', newAttachmentId[0].id)
      .first();
    if (!checkedAttachment) {
      throw new HttpException('Error creating attachment', 500);
    }
    return checkedAttachment;
  }

  async deleteAttachment(id: number) {
    const attachment = await this.db<Attachment>('attachments')
      .select('*')
      .where('id', id)
      .first();

    if (!attachment) throw new HttpException('Attachment not found', 404);

    fs.unlinkSync(attachment.fileUrl);

    await this.db<Attachment>('attachments').delete().where('id', id);

    if (
      await this.db<Attachment>('attachments')
        .select('*')
        .where('id', id)
        .first()
    ) {
      throw new HttpException('Error deleting attachment', 500);
    }
    return {
      status: HttpStatus.OK,
    };
  }

  async getAttachmentById(id: number) {
    const attachment = await this.db<Attachment>('attachments')
      .select('*')
      .where('id', id)
      .first();

    if (!attachment) throw new HttpException('Attachment not found', 404);

    return attachment;
  }

  async updateAttachment(
    id: number,
    body: UpdateAttachmentDto,
    file: Express.Multer.File,
  ) {
    await this.getAttachmentById(id);

    const filesDir = path.join(__dirname, '..', 'files');
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir);
    }
    const extension = '.' + file.mimetype.split('/')[1];
    const uniqueFilename = uuidv4() + extension;
    const filePath = path.join(filesDir, uniqueFilename);
    fs.writeFileSync(filePath, file.buffer);

    const attachment = await this.db<Attachment>('attachments')
      .select('*')
      .where('id', id)
      .first();

    if (!attachment) throw new HttpException('Attachment not found', 404);

    fs.unlinkSync(attachment.fileUrl);

    const newAttachment = {
      fileUrl: filePath,
    };

    await this.db<Attachment>('attachments')
      .update(newAttachment)
      .where('id', id);

    return newAttachment;
  }

  async getAttachmentsByAssociatedId(
    associatedId: number,
    attachmentType: AttachmentType,
  ) {
    const attachments = await this.db<Attachment>('attachments')
      .select('*')
      .where(
        `${attachmentType === 'advertisement' ? 'advertisementId' : 'offerId'}`,
        associatedId,
      );
    if (attachments.length === 0) {
      return [];
    }
    return attachments;
  }

  async downloadAttachment(id: number, res: Response) {
    const attachment = await this.getAttachmentById(id);
    const file = fs.createReadStream(attachment.fileUrl);

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${attachment.fileUrl.split('\\').pop()}"`,
    });

    return new StreamableFile(file);
  }
}
