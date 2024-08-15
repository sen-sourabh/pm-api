import { PickType } from '@nestjs/swagger';
import { ProviderFieldAssociation } from '../entities/provider_field_association.entity';

export class UpdateProviderFieldAssociationDto extends PickType(ProviderFieldAssociation, [
  'provider',
  'customField',
  'value',
  'addedBy',
]) {}
