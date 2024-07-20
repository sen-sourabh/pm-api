import { PickType } from '@nestjs/swagger';
import { Vault } from '../entities/vault.entity';

export class CreateVaultDto extends PickType(Vault, ['name', 'caption', 'description', 'user']) {}
