import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { RolesEnum } from '../../../core/shared/enums';

@ApiTags('UpdateVaultsCollaborator')
export class UpdateVaultsCollaboratorDto {
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

  @ApiProperty({
    description: 'The access of the vault',
    required: true,
    nullable: false,
    enum: RolesEnum,
  })
  @IsEnum(RolesEnum)
  access: RolesEnum;

  @ApiProperty({
    description: 'The user who given the access',
    required: true,
    nullable: false,
  })
  @IsString()
  addedBy: string;
}
