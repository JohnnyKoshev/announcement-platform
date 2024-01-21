import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DATABASE, Database } from 'src/database/database.service';
import { JuridicService } from '../juridic/juridic.service';
import { Offer } from '@prisma/client';
import { UserService } from '../user.service';

@Injectable()
export class IndividualService {
  constructor(
    @Inject(DATABASE) private db: Database,
    private juridicService: JuridicService,
    private userService: UserService,
  ) {}

  async getAdvertisementById(id: number) {
    return await this.juridicService.getAdvertisementById(id);
  }

  async getAllAdvertisements() {
    return await this.juridicService.getAllAdvertisements();
  }

  async createOffer(body: Partial<Offer>) {
    const newOfferId = await this.db<Offer>('offers')
      .insert(body)
      .returning('id');

    const offer = await this.db<Offer>('offers')
      .select('*')
      .where('id', newOfferId[0].id)
      .first();

    if (!offer) throw new HttpException('Error creating offer', 500);

    return offer;
  }

  async getOfferById(id: number) {
    const offer = await this.db<Offer>('offers')
      .select('*')
      .where('id', id)
      .first();

    if (!offer) throw new HttpException('Offer not found', 404);

    await this.setOfferRead(id);
    return {
      ...offer,
      attachments: await this.userService.getAttachmentsByAssociatedId(
        id,
        'offer',
      ),
    };
  }

  async getAllOffers() {
    const offers = await this.db<Offer>('offers').select('*');
    if (offers.length === 0) throw new HttpException('No offers found', 404);

    console.log(offers);
    const offersWithAttachments = await Promise.all(
      offers.map(async (offer) => ({
        ...offer,
        attachments: await this.userService.getAttachmentsByAssociatedId(
          offer.id,
          'offer',
        ),
      })),
    );
    for (const offer of offersWithAttachments) {
      await this.setOfferRead(offer.id);
    }
    return offersWithAttachments;
  }

  async updateOffer(id: number, body: Partial<Offer>) {
    const offer = await this.db<Offer>('offers')
      .select('*')
      .where('id', id)
      .first();

    if (!offer) throw new HttpException('Offer not found', 404);

    await this.db<Offer>('offers').update(body).where('id', id);

    return await this.getOfferById(id);
  }

  async deleteOffer(id: number) {
    const offer = await this.db<Offer>('offers')
      .select('*')
      .where('id', id)
      .first();

    if (!offer) throw new HttpException('Offer not found', 404);

    await this.db<Offer>('offers').delete().where('id', id);

    if (await this.db<Offer>('offers').select('*').where('id', id).first())
      throw new HttpException('Error deleting offer', 500);

    return {
      status: HttpStatus.OK,
    };
  }

  async setOfferRead(id: number) {
    const offer = await this.db<Offer>('offers')
      .select('*')
      .where('id', id)
      .first();

    if (!offer) throw new HttpException('Offer not found', 404);

    await this.db<Offer>('offers').update({ isRead: true }).where('id', id);
  }
}
