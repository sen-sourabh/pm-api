import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPagination, logErrorOnTerminal } from '../../helpers/serializers';
import { OrderEnum } from '../../shared/enums';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { CreateActivityLogDto } from './dtos/create-log.dto';
import { ListQueryActivityLogsDto } from './dtos/list-log.dto';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog) // Inject the LogEntry entity (if using one)
    private readonly activityLogRepository: Repository<ActivityLog>,
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

  async findAllActivityLogs(
    query?: ListQueryActivityLogsDto,
  ): Promise<ApiResponseModel<ActivityLog[]>> {
    try {
      const { skip, take } = getPagination(query);

      const data = await this.activityLogRepository.find({
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
      Logger.error(`Error in list activity log: ${error?.message}`);
      throw new InternalServerErrorException(`Error in list activity log: ${error?.message}`);
    }
  }
}
