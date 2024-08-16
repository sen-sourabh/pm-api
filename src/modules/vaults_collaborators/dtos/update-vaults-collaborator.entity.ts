import { ApiProperty, ApiTags, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { VaultsCollaborator } from '../entities/vaults_collaborator.entity';

@ApiTags('UpdateVaultsCollaborator')
export class UpdateVaultsCollaboratorDto extends PickType(VaultsCollaborator, [
  'role',
  'updatedBy',
  'isEnabled',
]) {
  @ApiProperty({
    description: 'The collaborator of the vault',
    required: true,
    nullable: false,
  })
  @IsString()
  user: string;

  @ApiProperty({
    description: 'The shared vault',
    required: true,
    nullable: false,
  })
  @IsString()
  vault: string;
}
