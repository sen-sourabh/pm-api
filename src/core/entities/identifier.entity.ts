import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'identifiers',
  comment: 'Identifier entity is just for extend/reuse',
})
@ApiTags('Identifiers')
export class Identifier {
  @ApiProperty({
    description: 'Id is the unique identifier',
    example: 'e762634c-3e41-11eb-b897-0862660ccbd4',
    type: 'string',
    required: true,
    default: 'uuid',
    name: 'id',
    nullable: false,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  @Column({ length: 150, type: 'varchar' })
  @IsString()
  id: string;
}
