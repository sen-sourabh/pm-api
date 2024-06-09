import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { CreateRoleDto } from './dto/create.dto';
import { ListQueryRolesDto } from './dto/list.dto';
import { UpdateRoleDto } from './dto/update.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}

  createRole(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAllRoles(query?: ListQueryRolesDto): Promise<ApiResponseModel<Role[]>> {
    const { skip, take } = query;
    delete query?.skip;
    delete query?.take;

    const result = await this.rolesRepository.find({
      where: query,
      skip,
      take,
      order: { id: Order.ASC },
    });

    return { data: result, metadata: { query } };
  }

  findOneRole(id: number) {
    return this.rolesRepository.findOne({ where: { id } });
  }

  updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  removeRole(id: number) {
    return `This action removes a #${id} role`;
  }
}
