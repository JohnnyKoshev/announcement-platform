import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Body, Post } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAttachmentDto } from 'src/user/dto/update-attachment.dto';
import type { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateOfferDto } from 'src/user/individual/dto/create-offer.dto';
import { CreateAdvertisementDto } from 'src/user/juridic/dto/create-ad.dto';
import { CreateChatDto } from 'src/user/dto/create-chat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleGuard } from 'src/auth/role.guard';

@Roles('admin')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('category/create')
  async createCategory(@Body() body: CategoryDto) {
    return await this.adminService.createCategory(body);
  }

  @Get('category/all')
  async getAllCategories() {
    return await this.adminService.getAllCategories();
  }

  @Delete('category/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.adminService.deleteCategory(Number(id));
  }

  @Patch('category/:id')
  async updateCategory(@Param('id') id: string, @Body() body: CategoryDto) {
    return await this.adminService.updateCategory(Number(id), body);
  }

  @Get('user/all')
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

  @Get('offer/all')
  async getAllOffers() {
    return await this.adminService.getAllOffers();
  }

  @Get('offer/:id')
  async getOfferById(@Param('id') id: string) {
    return await this.adminService.getOfferById(Number(id));
  }

  @Get('advertisement/:id')
  async getAdvertisementById(@Param('id') id: string) {
    return await this.adminService.getAdvertisementById(Number(id));
  }

  @Get('message/all')
  async getAllMessages() {
    return await this.adminService.getAllMessages();
  }

  @Get('message/:id')
  async getMessageById(@Param('id') id: string) {
    return await this.adminService.getMessageById(Number(id));
  }

  @Delete('message/:id')
  async deleteMessage(@Param('id') id: string) {
    return await this.adminService.deleteMessage(Number(id));
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.adminService.deleteUser(Number(id));
  }

  @Patch('user/:id')
  async updateUser(@Body() body, @Param('id') id: string) {
    return await this.adminService.updateUser(Number(id), body);
  }

  @Post('user/create')
  async createUser(@Body() body: CreateUserDto) {
    return await this.adminService.createUser(body);
  }

  @Get('chat/all')
  async getAllChats() {
    return await this.adminService.getAllChats();
  }

  @Delete('chat/:id')
  async deleteChat(@Param('id') id: string) {
    return await this.adminService.deleteChat(Number(id));
  }

  @Patch('chat/:id')
  async updateChat(@Param('id') id: string, @Body() body) {
    return await this.adminService.updateChat(Number(id), body);
  }

  @Post('chat/create')
  async createChat(@Body() body: CreateChatDto) {
    return await this.adminService.createChat(
      body.senderEmail,
      body.recipientEmail,
    );
  }

  @Get('attachment/all')
  async getAllAttachments() {
    return await this.adminService.getAllAttachments();
  }

  @Delete('attachment/:id')
  async deleteAttachment(@Param('id') id: string) {
    return await this.adminService.deleteAttachment(Number(id));
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
    return this.adminService.createAttachment(body, file);
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
    return this.adminService.updateAttachment(Number(id), body, file);
  }

  @Get('attachment/download/:id')
  getFile(@Res({ passthrough: true }) res: Response, @Param('id') id: string) {
    return this.adminService.downloadAttachment(Number(id), res);
  }

  @Get('category/:id')
  async getCategoryById(@Param('id') id: string) {
    return await this.adminService.getCategoryById(Number(id));
  }

  @Get('chat/:id')
  async getChatById(@Param('id') id: string) {
    return await this.adminService.getChatById(Number(id));
  }

  @Get('attachment/:id')
  async getAttachmentById(@Param('id') id: string) {
    return await this.adminService.getAttachmentById(Number(id));
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    return await this.adminService.getUserById(Number(id));
  }

  @Delete('offer/:id')
  async deleteOffer(@Param('id') id: string) {
    return await this.adminService.deleteOffer(Number(id));
  }

  @Get('advertisement/all')
  async getAllAdvertisements() {
    return await this.adminService.getAllAdvertisements();
  }

  @Delete('advertisement/:id')
  async deleteAdvertisement(@Param('id') id: string) {
    return await this.adminService.deleteAdvertisement(Number(id));
  }

  @Patch('advertisement/:id')
  async updateAdvertisement(@Param('id') id: string, @Body() body) {
    return await this.adminService.updateAdvertisement(Number(id), body);
  }

  @Patch('offer/:id')
  async updateOffer(@Body() body, @Param('id') id: string) {
    return await this.adminService.updateOffer(Number(id), body);
  }

  @Delete('offer/:id')
  async deleteOfferById(@Param('id') id: string) {
    return await this.adminService.deleteOffer(Number(id));
  }

  @Post('offer/create')
  async createOffer(@Body() body: CreateOfferDto) {
    return await this.adminService.createOffer(body);
  }

  @Post('advertisement/create')
  async createAdvertisement(@Body() body: CreateAdvertisementDto) {
    return await this.adminService.createAdvertisement(body);
  }
}
