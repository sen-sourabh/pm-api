import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { VaultsCollaboratorsService } from '../vaults_collaborators.service';

@Injectable()
export class ValidateVaultsCollaboratorPipe implements PipeTransform {
  constructor(private readonly vaultsCollaboratorsService: VaultsCollaboratorsService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async transform(value: any, metadata: ArgumentMetadata) {
    //Collaborator record exist or not
    if (metadata?.type === 'param') {
      const isExist = await this.vaultsCollaboratorsService.findCollaboratorByValue({ id: value });
      if (!isExist) throw new NotFoundException(`Record not found with id: ${value}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}
