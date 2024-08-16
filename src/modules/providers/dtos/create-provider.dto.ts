import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Provider } from '../entities/provider.entity';

export class CreateProviderDto extends PickType(Provider, ['description', 'addedBy']) {
  @ApiProperty({
    description: 'The vault where provider belongs to.',
    required: true,
    nullable: false,
  })
  @IsString()
  vault: string;

  @ApiProperty({
    description: 'The name of the provider',
    required: true,
  })
  @IsString({ message: 'name must be a string' })
  name: string;
}
