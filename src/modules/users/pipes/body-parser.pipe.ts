import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { generateSecretKey } from '../../../core/helpers/security';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class BodyParserPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    //append auto generated secret key with body
    const updateValue = {
      ...value,
      secretKey: generateSecretKey(),
    };

    return updateValue;
  }
}
