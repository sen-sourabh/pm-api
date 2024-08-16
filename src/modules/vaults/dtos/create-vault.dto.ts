import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';
import { Vault } from '../entities/vault.entity';

export class CreateVaultDto extends PickType(Vault, [
  'caption',
  'description',
  'isPrivate',
  'user',
]) {
  @ApiProperty({
    description: 'The name of the vault',
    required: true,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'name must be a string' })
  name: string;
}
