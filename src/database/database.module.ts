import { Module } from '@nestjs/common';
import { databaseProvider } from './database.service';

@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
