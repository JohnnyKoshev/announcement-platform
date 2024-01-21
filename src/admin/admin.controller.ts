import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Body, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('create/category')
  async createCategory(@Body() body: CreateCategoryDto) {
    return await this.adminService.createCategory(body);
  }
}
