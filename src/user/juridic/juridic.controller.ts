import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { JuridicService } from './juridic.service';
import { CreateAdvertisementDto } from './dto/create-ad.dto';
import { UpdateAdvertisementDto } from './dto/update-ad.dto';

@Controller('juridic')
export class JuridicController {
  constructor(private juridicService: JuridicService) {}

  @Post('advertisement/create')
  async createAdvertisement(@Body() body: CreateAdvertisementDto) {
    return this.juridicService.createAdvertisement(body);
  }

  @Get('advertisement/all')
  async getAllAdvertisements() {
    return this.juridicService.getAllAdvertisements();
  }

  @Get('advertisement/:id')
  async getAdvertisementById(@Param('id') id: string) {
    return this.juridicService.getAdvertisementById(Number(id));
  }

  @Get('category/all')
  async getAllCategories() {
    return this.juridicService.getAllCategories();
  }

  @Get('category/:id')
  async getCategoryById(@Param('id') id: string) {
    return this.juridicService.getCategoryById(Number(id));
  }

  @Patch('advertisement/:id')
  async updateAdvertisement(
    @Param('id') id: string,
    @Body() body: UpdateAdvertisementDto,
  ) {
    return this.juridicService.updateAdvertisement(Number(id), body);
  }

  @Delete('advertisement/:id')
  async deleteAdvertisement(@Param('id') id: string) {
    return this.juridicService.deleteAdvertisement(Number(id));
  }

  @Get('offer/top')
  async getTopOffers(@Query('limit') limit: string) {
    return this.juridicService.getTopOffers(Number(limit));
  }
}
