import { Inject, Injectable } from '@nestjs/common';
import { DATABASE, Database } from 'src/database/database.service';

@Injectable()
export class IndividualService {
  constructor(@Inject(DATABASE) private db: Database) {}

  async findOne(email: string) {
    return await this.db('users').select('*').where('email', email);
  }
}
