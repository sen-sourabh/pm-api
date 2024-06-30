import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { logErrorOnTerminal } from '../../helpers/serializers';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { CreateActivityLogDto } from './dtos/create-log.dto';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog) // Inject the LogEntry entity (if using one)
    private readonly logRepository: Repository<ActivityLog>,
  ) {}

  async createActivityLog(createActivityLogDto: CreateActivityLogDto): Promise<void> {
    try {
      // Optional: Further format or process log data
      const newLog = this.logRepository.create(createActivityLogDto);
      await this.logRepository.save(newLog);

      //On Console
      logErrorOnTerminal(createActivityLogDto);
    } catch (error) {
      Logger.error(`Error from create activity log: ${error?.message}`);
      Logger.fatal(`Unable to Logged: ${JSON.stringify(createActivityLogDto).toString()}`);
    }
  }

  async findAllActivityLogs(): Promise<ApiResponseModel<ActivityLog[]>> {
    try {
      const data = await this.logRepository.find();
      return {
        data,
      };
    } catch (error) {
      Logger.error(`Error in list activity logs: ${error?.message}`);
    }
  }
}
