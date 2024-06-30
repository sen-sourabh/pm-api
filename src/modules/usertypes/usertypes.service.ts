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
import { ListQueryUsertypesDto } from './dto/list-usertype.dto';
import { Usertype } from './entities/usertype.entity';

@Injectable()
export class UsertypesService {
  constructor(@InjectRepository(Usertype) private usertypesRepository: Repository<Usertype>) {}

  async findAllUsertypes(query?: ListQueryUsertypesDto): Promise<ApiResponseModel<Usertype[]>> {
    try {
      const { skip, take } = getPagination(query);

      const data = await this.usertypesRepository.find({
        where: query,
        skip,
        take,
        order: { id: OrderEnum.ASC },
      });

      return { data, metadata: { query } };
    } catch (error) {
      Logger.debug(`Error in list usertype: ${error?.message}`);
      throw new InternalServerErrorException(`Error in list usertype: ${error?.message}`);
    }
  }

  async findOneUsertype(id: number): Promise<ApiResponseModel<Usertype>> {
    const data = await this.usertypesRepository.findOne({ where: { id } });
    if (isMissing(data)) throw new NotFoundException(`Record not found by id: ${id}`);
    return { data, metadata: { params: { id } } };
  }

  async findUsertypeByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.usertypesRepository.findOne({
        where: { ...query, isDeleted: false },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in user operation: ${error.message}`);
      return false;
    }
  }
}
