import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination, logErrorOnTerminal } from '../../helpers/serializers';
import { isMissing } from '../../helpers/validations';
import { OrderEnum } from '../../shared/enums';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../shared/models/api-query.model';
import { CacheManagerService } from '../cache-manager/cache-manager.service';
import { CreateActivityLogDto } from './dtos/create-log.dto';
import { ListQueryActivityLogsDto } from './dtos/list-log.dto';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog) // Inject the LogEntry entity (if using one)
    private readonly activityLogRepository: Repository<ActivityLog>,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  async createActivityLog(createActivityLogDto: CreateActivityLogDto): Promise<void> {
    try {
      const newLog = this.activityLogRepository.create(createActivityLogDto);
      await this.activityLogRepository.save(newLog);

      logErrorOnTerminal(createActivityLogDto);
    } catch (error) {
      Logger.error(`Error from create activity log: ${error?.message}`);
      Logger.fatal(`Unable to Logged: ${JSON.stringify(createActivityLogDto).toString()}`);
    }
  }

  async findAllActivityLogs({
    request,
    listQueryActivityLogsData,
  }: {
    request: Request;
    listQueryActivityLogsData?: ListQueryActivityLogsDto;
  }): Promise<ApiResponseModel<ActivityLog[]>> {
    try {
      // From Cache
      let data = await this.cacheManagerService.cacheGetData(request);
      if (!isMissing(data)) {
        return {
          data,
          metadata: { query: listQueryActivityLogsData },
        };
      }

      // Not From Cache
      const { skip, take } = getPagination(listQueryActivityLogsData);

      data = await this.activityLogRepository.find({
        where: listQueryActivityLogsData,
        skip,
        take,
        order: { updatedAt: OrderEnum.DESC },
      });

      // Set in Cache
      await this.cacheManagerService.cacheSetData({
        request,
        data,
      });

      return {
        data,
        metadata: { query: listQueryActivityLogsData },
      };
    } catch (error) {
      Logger.error(`Error in list activity log: ${error?.message}`);
      throw new InternalServerErrorException(`Error in list activity log: ${error?.message}`);
    }
  }

  async findOneUser({
    request,
    id,
    query,
  }: {
    request: Request;
    id: string;
    query?: ApiQueryParamUnifiedModel;
  }): Promise<ApiResponseModel<ActivityLog>> {
    // From Cache
    let data = await this.cacheManagerService.cacheGetData(request);
    if (!isMissing(data)) {
      return {
        data,
        metadata: { query },
      };
    }

    // Not From Cache
    data = await this.activityLogRepository.findOne({
      where: { id },
    });
    if (isMissing(data)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }

    // Set in Cache
    await this.cacheManagerService.cacheSetData({
      request,
      data,
    });

    return { data, metadata: { query } };
  }
}
