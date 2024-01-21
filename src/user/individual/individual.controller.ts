import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { IndividualService } from './individual.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleGuard } from 'src/auth/role.guard';

@Roles('individual', 'admin')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('individual')
export class IndividualController {
  constructor(private individualService: IndividualService) {}

  @Post('offer/create')
  async createOffer(@Body() body: CreateOfferDto) {
    return this.individualService.createOffer(body);
  }

  @Get('offer/all')
  async getOffers() {
    return this.individualService.getAllOffers();
  }

  @Get('offer/:id')
  async getOfferById(@Param('id') id: string) {
    return this.individualService.getOfferById(Number(id));
  }

  @Delete('offer/:id')
  async deleteOffer(@Param('id') id: string) {
    return this.individualService.deleteOffer(Number(id));
  }

  @Patch('offer/:id')
  async updateOffer(@Param('id') id: string, @Body() body: UpdateOfferDto) {
    return this.individualService.updateOffer(Number(id), body);
  }

  @Get('advertisement/all')
  async getAllAdvertisements() {
    return this.individualService.getAllAdvertisements();
  }

  @Get('advertisement/:id')
  async getAdvertisementById(@Param('id') id: string) {
    return this.individualService.getAdvertisementById(Number(id));
  }
}
