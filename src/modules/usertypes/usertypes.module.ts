import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usertype } from './entities/usertype.entity';
import { UsertypesController } from './usertypes.controller';
import { UsertypesService } from './usertypes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usertype])],
  controllers: [UsertypesController],
  providers: [UsertypesService],
})
export class UsertypesModule {}
