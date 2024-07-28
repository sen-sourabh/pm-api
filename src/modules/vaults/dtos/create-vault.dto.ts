import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vault } from '../entities/vault.entity';

export class CreateVaultDto extends PickType(Vault, ['caption', 'description']) {
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

  @ApiProperty({
    description: 'The owner of the vault',
    required: true,
  })
  @ManyToOne(() => User)
  @Column({ name: 'userId', nullable: false })
  @IsString({
    message: 'user id must be a string',
  })
  user: string;
}
