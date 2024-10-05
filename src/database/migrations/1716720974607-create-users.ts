import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';

export class CreateUsers1716720974607 implements MigrationInterface {
  private readonly logger = new Logger(CreateUsers1716720974607.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'users',
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
              name: 'firstName',
              type: 'varchar',
              length: '100',
              isNullable: true,
              default: null,
            },
            {
              name: 'lastName',
              type: 'varchar',
              length: '100',
              isNullable: true,
              default: null,
            },
            {
              name: 'organizationName',
              type: 'varchar',
              length: '255',
              isNullable: true,
              default: null,
            },
            {
              name: 'organizationPosition',
              type: 'varchar',
              length: '150',
              isNullable: true,
              default: null,
            },
            {
              name: 'noOfEmployees',
              type: 'varchar',
              length: '15',
              isNullable: true,
              default: null,
            },
            {
              name: 'email',
              type: 'varchar',
              length: '150',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'password',
              type: 'varchar',
              isNullable: true,
              default: null,
            },
            {
              name: 'otp',
              type: 'int',
              isNullable: true,
              default: null,
            },
            {
              name: 'secretKey',
              type: 'varchar',
              length: '255',
              isUnique: true,
            },
            {
              name: 'phoneNumber',
              type: 'bigint',
              isNullable: true,
              default: null,
            },
            {
              name: 'lastLogin',
              type: 'datetime',
              isNullable: true,
              default: null,
            },
            {
              name: 'isLogin',
              type: 'tinyint',
              isNullable: false,
              default: 0,
            },
            {
              name: 'isEnabled',
              type: 'tinyint',
              isNullable: false,
              default: 1,
            },
            {
              name: 'isDeleted',
              type: 'tinyint',
              isNullable: false,
              default: 0,
            },
            {
              name: 'createdAt',
              type: 'datetime',
              isNullable: false,
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updatedAt',
              type: 'datetime',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
            {
              name: 'roleId',
              type: 'int',
              isNullable: false,
              default: 2,
            },
            {
              name: 'accountTypeId',
              type: 'int',
              isNullable: false,
              default: 2,
            },
          ],
          foreignKeys: [
            // Foreign key for role association
            {
              name: 'FK_users_roles',
              columnNames: ['roleId'],
              referencedTableName: 'roles',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
            // Foreign key for account type association
            {
              name: 'FK_users_account_types',
              columnNames: ['accountTypeId'],
              referencedTableName: 'account_types',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
          ],
        }),
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create users executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'users', (error as ApiErrorResponse)?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('users');
      this.logger.log(`Down: Drop users executed`);
    } catch (error) {
      this.logger.error(`Down: Drop users has an error: `, (error as ApiErrorResponse)?.message);
    }
  }
}
