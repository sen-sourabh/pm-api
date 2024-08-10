import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ProvidersService } from '../providers.service';

@Injectable()
export class ValidateProviderPipe implements PipeTransform {
  constructor(private readonly providersService: ProvidersService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    //Collaborator record exist or not
    if (metadata?.type === 'param') {
      const isExist = await this.providersService.findProviderByValue({ id: value });
      if (!isExist) throw new NotFoundException(`Record not found with id: ${value}`);
    }

    return true;
  }
}
