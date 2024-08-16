import { PartialType } from '@nestjs/swagger';
import { CreateAccountTypeDto } from './create-account_type.dto';

export class UpdateAccountTypeDto extends PartialType(CreateAccountTypeDto) {}
