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
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';
import { OrderEnum } from '../../core/shared/enums';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { ListQueryAccountTypesDto } from './dto/list-account_type.dto';
import { AccountType } from './entities/account_type.entity';

@Injectable()
export class AccountTypesService {
  constructor(
    @InjectRepository(AccountType)
    private accountTypesRepository: Repository<AccountType>,
  ) {}

  async findAllAccountTypes(
    query?: ListQueryAccountTypesDto,
  ): Promise<ApiResponseModel<AccountType[]>> {
    try {
      const { skip, take } = getPagination(query);

      const data = await this.accountTypesRepository.find({
        where: query,
        skip,
        take,
        order: { id: OrderEnum.ASC },
      });

      return { data, metadata: { query } };
    } catch (error) {
      Logger.debug(`Error in list account type: ${(error as ApiErrorResponse)?.message}`);
      throw new InternalServerErrorException(
        `Error in list account type: ${(error as ApiErrorResponse)?.message}`,
      );
    }
  }

  async findOneAccountType(id: number): Promise<ApiResponseModel<AccountType>> {
    const data = await this.accountTypesRepository.findOneBy({ id });
    if (isMissing(data)) throw new NotFoundException(`Record not found by id: ${id}`);
    return { data, metadata: { params: { id } } };
  }

  async findAccountTypeByValue(query: Record<string, unknown>): Promise<boolean> {
    try {
      const data = await this.accountTypesRepository.findOne({
        where: { ...query, isDeleted: false },
      });
      if (isMissing(data)) {
        return false;
      }
      return true;
    } catch (error) {
      Logger.error(`Error in account type operation: ${(error as ApiErrorResponse).message}`);
      return false;
    }
  }
}
