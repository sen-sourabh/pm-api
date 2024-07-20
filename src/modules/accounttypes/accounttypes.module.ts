import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccounttypesController } from './accounttypes.controller';
import { AccounttypesService } from './accounttypes.service';
import { Accounttype } from './entities/accounttype.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounttype])],
  controllers: [AccounttypesController],
  providers: [AccounttypesService],
})
export class AccounttypesModule {}
