import { DatabaseModule } from 'src/database/database.module';
import { JuridicService } from './juridic.service';
import { Module } from '@nestjs/common';
import { JuridicController } from './juridic.controller';

@Module({
  providers: [JuridicService],
  imports: [DatabaseModule],
  controllers: [JuridicController],
})
export class JuridicModule {}
