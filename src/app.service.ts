import { Inject, Injectable } from '@nestjs/common';
import { Database, DATABASE } from './database/database.service';

@Injectable()
export class AppService {
  constructor(@Inject(DATABASE) private db: Database) {}

  getHello(): string {
    return 'Hello World!';
  }
}
