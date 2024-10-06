import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';

export class CreateFeatures1728195182977 implements MigrationInterface {
  private readonly logger = new Logger(CreateFeatures1728195182977.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'features',
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
              name: 'name',
              type: 'varchar',
              length: '150',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'mediumtext',
              isNullable: true,
            },
            {
              name: 'isEnabled',
              type: 'tinyint',
              default: 1,
            },
            {
              name: 'isDeleted',
              type: 'tinyint',
              default: 0,
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
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create features executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'features', (error as ApiErrorResponse)?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('features');
      this.logger.log(`Down: Drop features executed`);
    } catch (error) {
      this.logger.error(`Down: Drop features has an error: `, (error as ApiErrorResponse)?.message);
    }
  }
}
