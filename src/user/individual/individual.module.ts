import { Module } from '@nestjs/common';
import { IndividualService } from './individual.service';
import { IndividualController } from './individual.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JuridicModule } from '../juridic/juridic.module';
import { UserModule } from '../user.module';

@Module({
  providers: [IndividualService],
  controllers: [IndividualController],
  imports: [DatabaseModule, JuridicModule, UserModule],
  exports: [IndividualService],
})
export class IndividualModule {}
