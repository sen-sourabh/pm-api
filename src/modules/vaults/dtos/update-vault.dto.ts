import { PickType } from '@nestjs/swagger';
import { Vault } from '../entities/vault.entity';

export class UpdateVaultDto extends PickType(Vault, [
  'name',
  'caption',
  'description',
  'user',
  'lastAccess',
  'isEnabled',
  'isDeleted',
]) {}
