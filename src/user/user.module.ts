import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [DatabaseModule],
  controllers: [UserController],
})
export class UserModule {}
