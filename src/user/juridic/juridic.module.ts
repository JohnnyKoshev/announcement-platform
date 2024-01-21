import { DatabaseModule } from 'src/database/database.module';
import { JuridicService } from './juridic.service';
import { Module } from '@nestjs/common';
import { JuridicController } from './juridic.controller';
import { UserModule } from '../user.module';

@Module({
  providers: [JuridicService],
  imports: [DatabaseModule, UserModule],
  controllers: [JuridicController],
  exports: [JuridicService],
})
export class JuridicModule {}
