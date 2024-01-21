import { Module } from '@nestjs/common';
import { IndividualService } from './individual.service';
import { IndividualController } from './individual.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [IndividualService],
  controllers: [IndividualController],
  imports: [DatabaseModule],
})
export class IndividualModule {}
