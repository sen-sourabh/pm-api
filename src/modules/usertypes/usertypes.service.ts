import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isMissing } from '../../core/helpers/validations';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ListQueryUsertypesDto } from './dto/list-usertype.dto';
import { Usertype } from './entities/usertype.entity';

@Injectable()
export class UsertypesService {
  constructor(@InjectRepository(Usertype) private usertypesRepository: Repository<Usertype>) {}

  async findAllUsertypes(query?: ListQueryUsertypesDto): Promise<ApiResponseModel<Usertype[]>> {
    const { skip, take } = query;
    delete query?.skip;
    delete query?.take;

    const data = await this.usertypesRepository.find({
      where: query,
      skip,
      take,
      order: { id: OrderEnum.ASC },
    });

    return { data, metadata: { query } };
  }

  async findOneUsertype(id: number): Promise<ApiResponseModel<Usertype>> {
    const data = await this.usertypesRepository.findOne({ where: { id } });
    if (isMissing(data)) throw new NotFoundException(`Record not found by id: ${id}`);
    return { data, metadata: { params: { id } } };
  }

  async findUsertypeByValue(query: Record<string, unknown>): Promise<boolean> {
    const data = await this.usertypesRepository.findOne({ where: { ...query, isDeleted: false } });
    if (isMissing(data)) {
      return false;
    }
    return true;
  }
}
