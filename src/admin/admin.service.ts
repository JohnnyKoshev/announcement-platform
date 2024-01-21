/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { DATABASE, Database } from 'src/database/database.service';

@Injectable()
export class AdminService {
  constructor(@Inject(DATABASE) private db: Database) {}

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
}
