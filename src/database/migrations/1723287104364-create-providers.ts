import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';

export class CreateProviders1723287104364 implements MigrationInterface {
  private readonly logger = new Logger(CreateProviders1723287104364.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'providers',
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
              name: 'vaultId',
              type: 'varchar',
              length: '255',
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
              name: 'description',
              type: 'varchar',
              length: '255',
              isNullable: true,
              default: null,
            },
            {
              name: 'lastAccessed',
              type: 'datetime',
              isNullable: true,
              default: null,
            },
            {
              name: 'addedById',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'isEnabled',
              type: 'tinyint',
              default: 1,
              isNullable: false,
            },
            {
              name: 'isDeleted',
              type: 'tinyint',
              default: 0,
              isNullable: false,
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
              name: 'FK_providers_vaults',
              columnNames: ['vaultId'],
              referencedTableName: 'vaults',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
            {
              name: 'FK_providers_users',
              columnNames: ['addedById'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
          ],
        }),
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create providers executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'providers', (error as ApiErrorResponse)?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('providers');
      this.logger.log(`Down: Drop providers executed`);
    } catch (error) {
      this.logger.error(
        `Down: Drop providers has an error: `,
        (error as ApiErrorResponse)?.message,
      );
    }
  }
}
