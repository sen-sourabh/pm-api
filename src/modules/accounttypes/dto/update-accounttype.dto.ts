import { PartialType } from '@nestjs/swagger';
import { CreateAccounttypeDto } from './create-accounttype.dto';

export class UpdateAccounttypeDto extends PartialType(CreateAccounttypeDto) {}
