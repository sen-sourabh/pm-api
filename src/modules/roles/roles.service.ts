import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isMissing } from '../../core/helpers/validations';
import { Order } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ListQueryRolesDto } from './dto/list-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}

  async findAllRoles(query?: ListQueryRolesDto): Promise<ApiResponseModel<Role[]>> {
    const { skip, take } = query;
    delete query?.skip;
    delete query?.take;

    const data = await this.rolesRepository.find({
      where: query,
      skip,
      take,
      order: { id: Order.ASC },
    });

    return {
      data,
      metadata: { query },
    };
  }

  async findOneRole(id: number): Promise<ApiResponseModel<Role>> {
    const data = await this.rolesRepository.findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Record not found by id: ${id}`);
    return { data, metadata: { params: { id } } };
  }

  async findRoleByValue(query: Record<string, unknown>): Promise<boolean> {
    const data = await this.rolesRepository.findOne({ where: { ...query, isDeleted: false } });
    console.log('Role found: ', data);
    if (isMissing(data)) {
      return false;
    }
    return true;
  }
}
