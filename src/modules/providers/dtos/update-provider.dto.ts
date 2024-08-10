import { PickType } from '@nestjs/swagger';
import { Provider } from '../entities/provider.entity';

export class UpdateProviderDto extends PickType(Provider, [
  'name',
  'description',
  'lastAccessed',
  'addedBy',
  'isEnabled',
  'isDeleted',
  'vault',
]) {}
