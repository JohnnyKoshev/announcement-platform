/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { Response } from 'express';
import { DATABASE, Database } from 'src/database/database.service';
import { IndividualService } from 'src/user/individual/individual.service';
import { JuridicService } from 'src/user/juridic/juridic.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private userService: UserService,
    private juridicService: JuridicService,
    private individualService: IndividualService,
  ) {}

  async createCategory(body: {
    name: string;
    description: string;
  }): Promise<Partial<Category>> {
    const category = {
      name: body.name,
      description: body.description,
    };
    const result = await this.db<Category>('categories').insert(category);
    if (result) {
      return category;
    }
    throw new HttpException('Error creating category', 500);
  }

  async deleteCategory(id: number): Promise<Partial<Category>> {
    const result = await this.db<Category>('categories')
      .delete()
      .where('id', id)
      .returning('*');
    if (result) {
      return result[0];
    }
    throw new HttpException('Error deleting category', 500);
  }

  async updateCategory(id: number, body): Promise<Partial<Category>> {
    const result = await this.db<Category>('categories')
      .update(body)
      .where('id', id)
      .returning('*');
    if (result) {
      return result[0];
    }
    throw new HttpException('Error updating category', 500);
  }

  async getAllCategories(): Promise<Partial<Category>[]> {
    const result = await this.db<Category>('categories').select('*');
    if (!result) {
      throw new HttpException('Error getting categories', 500);
    }
    return result;
  }

  async getCategoryById(id: number): Promise<Partial<Category>> {
    const result = await this.db<Category>('categories')
      .select('*')
      .where('id', id)
      .first();
    if (!result) {
      throw new HttpException('Category not found', 404);
    }
    return result;
  }

  async createAdvertisement(body) {
    return await this.juridicService.createAdvertisement(body);
  }

  async getAllAdvertisements() {
    return await this.juridicService.getAllAdvertisements();
  }

  async getAdvertisementById(id: number) {
    return await this.juridicService.getAdvertisementById(id);
  }

  async getAllOffers() {
    return await this.individualService.getAllOffers();
  }

  async getOfferById(id: number) {
    return await this.individualService.getOfferById(id);
  }

  async getAllAttachments() {
    return await this.userService.getAllAttachments();
  }

  async getAttachmentById(id: number) {
    return await this.userService.getAttachmentById(id);
  }

  async createAttachment(id, body) {
    return await this.userService.createAttachment(id, body);
  }

  async deleteAttachment(id: number) {
    return await this.userService.deleteAttachment(id);
  }

  async updateAttachment(id: number, body, file) {
    return await this.userService.updateAttachment(id, body, file);
  }

  async downloadAttachment(id: number, res: Response) {
    return await this.userService.downloadAttachment(id, res);
  }

  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  async getUserById(id: number) {
    return await this.userService.getUserById(id);
  }

  async createUser(body) {
    return await this.userService.createUser(body);
  }

  async deleteUser(id: number) {
    return await this.userService.deleteUser(id);
  }

  async updateUser(id: number, body) {
    return await this.userService.updateUser(id, body);
  }

  async getAllChats() {
    return await this.userService.getAllChats();
  }

  async getChatById(id: number) {
    return await this.userService.getChatById(id);
  }

  async createChat(senderEmail: string, recipientEmail: string) {
    return await this.userService.createChat(senderEmail, recipientEmail);
  }

  async deleteChat(id: number) {
    return await this.userService.deleteChat(id);
  }

  async updateChat(id: number, body) {
    return await this.userService.updateChat(id, body);
  }

  async getAllMessages() {
    return await this.userService.getAllMessages();
  }

  async getMessageById(id: number) {
    return await this.userService.getMessageById(id);
  }

  async createMessage(message, senderEmail, recipientEmail) {
    return await this.userService.createMessage(
      message,
      senderEmail,
      recipientEmail,
    );
  }

  async deleteMessage(id: number) {
    return await this.userService.deleteMessage(id);
  }

  async updateMessage(id: number, body) {
    return await this.userService.updateMessage(id, body);
  }

  async createOffer(body) {
    return await this.individualService.createOffer(body);
  }

  async deleteOffer(id: number) {
    return await this.individualService.deleteOffer(id);
  }

  async updateOffer(id: number, body) {
    return await this.individualService.updateOffer(id, body);
  }

  async deleteAdvertisement(id: number) {
    return await this.juridicService.deleteAdvertisement(id);
  }

  async updateAdvertisement(id: number, body) {
    return await this.juridicService.updateAdvertisement(id, body);
  }
}
