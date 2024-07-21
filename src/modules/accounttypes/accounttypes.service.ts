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
import { ListQueryAccounttypesDto } from './dto/list-accounttype.dto';
import { Accounttype } from './entities/accounttype.entity';

@Injectable()
export class AccounttypesService {
  constructor(
    @InjectRepository(Accounttype) private accounttypesRepository: Repository<Accounttype>,
  ) {}

  async findAllAccounttypes(
    query?: ListQueryAccounttypesDto,
  ): Promise<ApiResponseModel<Accounttype[]>> {
    try {
      const { skip, take } = getPagination(query);

      const data = await this.accounttypesRepository.find({
        where: query,
        skip,
        take,
        order: { id: OrderEnum.ASC },
      });

      return { data, metadata: { query } };
    } catch (error) {
      Logger.debug(`Error in list accounttype: ${error?.message}`);
      throw new InternalServerErrorException(`Error in list accounttype: ${error?.message}`);
    }
  }

  async findOneAccounttype(id: number): Promise<ApiResponseModel<Accounttype>> {
    const data = await this.accounttypesRepository.findOneBy({ id });
    if (isMissing(data)) throw new NotFoundException(`Record not found by id: ${id}`);
    return { data, metadata: { params: { id } } };
  }

  async findAccounttypeByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.accounttypesRepository.findOne({
        where: { ...query, isDeleted: false },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in accounttype operation: ${error.message}`);
      return false;
    }
  }
}
