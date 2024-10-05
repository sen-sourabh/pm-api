import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';

export class CreateActivityLogs1720346348176 implements MigrationInterface {
  private readonly logger = new Logger(CreateActivityLogs1720346348176.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'activity_logs',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
              isNullable: false,
            },
            {
              name: 'handler',
              type: 'varchar',
              isNullable: true,
              default: null,
            },
            {
              name: 'method',
              type: 'varchar',
              isNullable: true,
              default: null,
            },
            {
              name: 'responseCode',
              type: 'int',
              isNullable: true,
              default: null,
            },
            {
              name: 'headers',
              type: 'json',
              isNullable: true,
              default: null,
            },
            {
              name: 'request',
              type: 'json',
              isNullable: true,
              default: null,
            },
            {
              name: 'response',
              type: 'json',
              isNullable: true,
              default: null,
            },
            {
              name: 'ipAddress',
              type: 'varchar',
              isNullable: true,
              default: null,
            },
            {
              name: 'location',
              type: 'varchar',
              isNullable: true,
              default: null,
            },
            {
              name: 'createdAt',
              type: 'datetime',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
            {
              name: 'updatedAt',
              type: 'datetime',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
          ],
        }),
        false,
      );
      this.logger.log(`Up: Create activity_logs executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'activity_logs', (error as ApiErrorResponse)?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('activity_logs');
      this.logger.log(`Down: Drop activity_logs executed`);
    } catch (error) {
      this.logger.error(
        `Down: Drop activity_logs has an error: `,
        (error as ApiErrorResponse)?.message,
      );
    }
  }
}
