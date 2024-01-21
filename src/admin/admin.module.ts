import { AdminController } from './admin.controller';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController, AdminController],
  imports: [DatabaseModule],
})
export class AdminModule {}
