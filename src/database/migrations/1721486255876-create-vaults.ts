import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';

export class CreateVaults1721486255876 implements MigrationInterface {
  private readonly logger = new Logger(CreateVaults1721486255876.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'vaults',
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
              name: 'caption',
              type: 'varchar',
              length: '100',
              isNullable: true,
            },
            {
              name: 'description',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'isPrivate',
              type: 'tinyint',
              default: 1,
            },
            {
              name: 'userId',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'lastAccessed',
              type: 'datetime',
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
          foreignKeys: [
            // Foreign key for role association
            {
              name: 'FK_vaults_users',
              columnNames: ['userId'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
          ],
        }),
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create vaults executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'vaults', (error as ApiErrorResponse)?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('vaults');
      this.logger.log(`Down: Drop vaults executed`);
    } catch (error) {
      this.logger.error(`Down: Drop vaults has an error: `, (error as ApiErrorResponse)?.message);
    }
  }
}
