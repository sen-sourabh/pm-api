import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../core/shared/enums';
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
      order: { id: Order.ASC },
    });

    return { data, metadata: { query } };
  }

  async findOneUsertype(id: number): Promise<ApiResponseModel<Usertype>> {
    const data = await this.usertypesRepository.findOne({ where: { id } });
    if (!data) throw new NotFoundException(`Record not found by id: ${id}`);
    return { data, metadata: { params: { id } } };
  }
}
