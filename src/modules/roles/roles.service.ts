import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination } from '../../core/helpers/serializers';
import { isMissing } from '../../core/helpers/validations';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ListQueryRolesDto } from './dto/list-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}

  async findAllRoles(query?: ListQueryRolesDto): Promise<ApiResponseModel<Role[]>> {
    try {
      const { skip, take } = getPagination(query);

      const data = await this.rolesRepository.find({
        where: query,
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      });

      return {
        data,
        metadata: { query },
      };
    } catch (error) {
      Logger.error(`Error in list roles: ${error.message}`);
      throw new InternalServerErrorException(`Error in list roles: ${error.message}`);
    }
  }

  async findOneRole(id: number): Promise<ApiResponseModel<Role>> {
    const data = await this.rolesRepository.findOne({ where: { id } });
    if (isMissing(data)) throw new NotFoundException(`Record not found by id: ${id}`);
    return { data, metadata: { params: { id } } };
  }

  async findRoleByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.rolesRepository.findOne({ where: { ...query, isDeleted: false } });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in role operation: ${error.message}`);
      return false;
    }
  }
}
