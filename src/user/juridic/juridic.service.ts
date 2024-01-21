/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Advertisement, Category, Offer } from '@prisma/client';
import { DATABASE, Database } from 'src/database/database.service';
import { UserService } from '../user.service';

interface IAdvertisement {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: Category;
  expirationDate: Date;
  creationDate: Date;
}
@Injectable()
export class JuridicService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private userService: UserService,
  ) {}

  async createAdvertisement(body) {
    const advertisement = {
      userId: body.userId,
      title: body.title,
      description: body.description,
      expirationDate: body.expirationDate,
      creationDate: new Date(),
      categoryId: body.categoryId,
    };
    const newAdId = await this.db<Advertisement>('advertisements')
      .insert(advertisement)
      .returning('id');
    if (!newAdId[0].id) {
      throw new HttpException('Error creating advertisement', 500);
    }
    const { categoryId, ...rest } = advertisement;
    return {
      ...rest,
      category: await this.getCategoryById(body.categoryId),
      attachments: await this.userService.getAttachmentsByAssociatedId(
        newAdId[0].id,
        'advertisement',
      ),
    };
  }

  async getCategoryById(id: number): Promise<Category> {
    if (!id) throw new HttpException('Category not found', 404);
    const result = await this.db<Category>('categories')
      .select('*')
      .where('id', id)
      .first();
    if (!result) {
      throw new HttpException('Category not found', 404);
    }
    return result;
  }

  async getAdvertisementById(id: number) {
    if (!id) throw new HttpException('Advertisement not found', 404);
    const result = await this.db<Advertisement>('advertisements')
      .select('*')
      .where('id', id)
      .first();
    if (!result) {
      throw new HttpException('Advertisement not found', 404);
    }
    const { categoryId, ...rest } = result;
    return {
      ...rest,
      category: await this.getCategoryById(categoryId),
      attachments: await this.userService.getAttachmentsByAssociatedId(
        id,
        'advertisement',
      ),
    };
  }

  async getAllCategories(): Promise<Category[]> {
    const result = await this.db<Category>('categories').select('*');
    if (result.length === 0) {
      throw new HttpException('No categories found', 404);
    }
    return result;
  }

  async getAllAdvertisements() {
    this.autoExpireAdvertisements();
    const result = await this.db<Advertisement>('advertisements').select('*');
    const ads = [];
    for (const ad of result) {
      const { categoryId, ...rest } = ad;
      ads.push({
        ...rest,
        category: await this.getCategoryById(ad.categoryId),
        attachments: await this.userService.getAttachmentsByAssociatedId(
          ad.id,
          'advertisement',
        ),
      });
    }
    return ads;
  }

  async autoExpireAdvertisements(): Promise<void> {
    const result = await this.db<Advertisement>('advertisements')
      .select('*')
      .where('expirationDate', '<', new Date());
    if (result.length === 0) {
      return;
    }
    for (const ad of result) {
      await this.db<Advertisement>('advertisements')
        .update({
          active: false,
        })
        .where('id', ad.id);
    }
  }

  async updateAdvertisement(id, body) {
    if (!(await this.getAdvertisementById(id))) {
      throw new HttpException('Advertisement not found', 404);
    }
    const resultId = await this.db<Advertisement>('advertisements')
      .update(body)
      .where('id', id)
      .returning('id');
    if (!resultId) {
      throw new HttpException('Error updating advertisement', 500);
    }
    const updatedAd = await this.db<Advertisement>('advertisements')
      .select('*')
      .where('id', resultId[0].id)
      .first();
    const { categoryId, ...rest } = updatedAd;
    return {
      ...rest,
      category: await this.getCategoryById(categoryId),
      attachments: await this.userService.getAttachmentsByAssociatedId(
        id,
        'advertisement',
      ),
    };
  }

  async deleteAdvertisement(id: number) {
    if (
      !(await this.db<Advertisement>('advertisements')
        .select('*')
        .where('id', id)
        .first())
    ) {
      throw new HttpException('Advertisement not found', 404);
    }

    await this.db<Advertisement>('advertisements').delete().where('id', id);

    if (
      await this.db<Advertisement>('advertisements')
        .select('*')
        .where('id', id)
        .first()
    ) {
      throw new HttpException('Error deleting advertisement', 500);
    }

    return {
      status: HttpStatus.OK,
    };
  }

  async getTopOffers(paginationNumber: number): Promise<Offer[]> {
    // the top offer criteria: lower price, lower estimatedCompletionDate
    const result = await this.db<Offer>('offers')
      .select('*')
      .orderBy('price')
      .orderBy('estimatedCompletionDate')
      .limit(paginationNumber);
    if (result.length === 0) {
      throw new HttpException('No offers found', 404);
    }
    const offers = [];
    for (const offer of result) {
      offers.push({
        ...offer,
        attachments: await this.userService.getAttachmentsByAssociatedId(
          offer.id,
          'offer',
        ),
      });
    }
    return result;
  }

  async getOffersByAdvertisementId(advertisementId: number): Promise<Offer[]> {
    const result = await this.db<Offer>('offers')
      .select('*')
      .where('advertisementId', advertisementId);
    if (result.length === 0) {
      throw new HttpException('No offers found', 404);
    }
    const offers = [];
    for (const offer of result) {
      offers.push({
        ...offer,
        attachments: await this.userService.getAttachmentsByAssociatedId(
          offer.id,
          'offer',
        ),
      });
    }
    return result;
  }
}
