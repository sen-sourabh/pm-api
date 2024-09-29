import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';

export class CreatePlans1727610358954 implements MigrationInterface {
  private readonly logger = new Logger(CreatePlans1727610358954.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'plans',
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
              length: '100',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'heading',
              type: 'varchar',
              length: '150',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'mediumtext',
              isNullable: false,
            },
            {
              name: 'price',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'currency',
              type: 'varchar',
              length: '10',
              isNullable: false,
            },
            {
              name: 'discountPercentage',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'discountPrice',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'features',
              type: 'simple-array',
              isNullable: false,
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
      this.logger.log(`Up: Create plans executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'plans', error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('plans');
      this.logger.log(`Down: Drop plans executed`);
    } catch (error) {
      this.logger.error(`Down: Drop plans has an error: `, error?.message);
    }
  }
}
