import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/models/api-response.model';
import { CreateRoleDto } from './dto/create.dto';
import { ListQueryRolesDto } from './dto/list.dto';
import { UpdateRoleDto } from './dto/update.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll(query?: Partial<ListQueryRolesDto>): Promise<ApiResponseModel> {
    // console.log("query: ", query);
    const { skip, take } = query;
    delete query?.skip;
    delete query?.take;
    //We need a Pipe here
    const result = await this.rolesRepository.find({
      where: query,
      skip,
      take,
      order: { id: Order.ASC },
    });
    // console.log("result: ", ...result);

    return { data: result, metadata: { query } };
  }

  findOne(id: number) {
    return this.rolesRepository.findOne({ where: { id } });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
