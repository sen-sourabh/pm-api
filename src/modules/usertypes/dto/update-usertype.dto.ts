import { PartialType } from '@nestjs/swagger';
import { CreateUsertypeDto } from './create-usertype.dto';

export class UpdateUsertypeDto extends PartialType(CreateUsertypeDto) {}
