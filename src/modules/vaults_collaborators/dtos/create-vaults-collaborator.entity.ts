import { ApiProperty, ApiTags, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { VaultsCollaborator } from '../entities/vaults_collaborator.entity';

@ApiTags('CreateVaultsCollaborator')
export class CreateVaultsCollaboratorDto extends PickType(VaultsCollaborator, ['role']) {
  @ApiProperty({
    description: 'The collaborator`s email id of the vault',
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

  @ApiProperty({
    description: 'The user who given the access',
    required: true,
    nullable: false,
  })
  @IsString()
  addedBy: string;
}
