import { AdminController } from './admin.controller';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { JuridicModule } from 'src/user/juridic/juridic.module';
import { IndividualModule } from 'src/user/individual/individual.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [DatabaseModule, UserModule, JuridicModule, IndividualModule],
})
export class AdminModule {}
