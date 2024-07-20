import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';

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
            },
            {
              name: 'lastName',
              type: 'varchar',
              length: '100',
              isNullable: true,
            },
            {
              name: 'organizationName',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'organizationPosition',
              type: 'varchar',
              length: '150',
              isNullable: true,
            },
            {
              name: 'noOfEmployees',
              type: 'varchar',
              length: '15',
              isNullable: true,
            },
            {
              name: 'email',
              type: 'varchar',
              length: '150',
              isUnique: true,
            },
            {
              name: 'password',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'otp',
              type: 'int',
              isNullable: true,
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
            },
            {
              name: 'lastLogin',
              type: 'datetime',
              isNullable: true,
            },
            {
              name: 'isLogin',
              type: 'tinyint',
              default: 0,
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
            {
              name: 'roleId',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'accounttypeId',
              type: 'int',
              isNullable: false,
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
            // Foreign key for accounttype association
            {
              name: 'FK_users_accounttypes',
              columnNames: ['accounttypeId'],
              referencedTableName: 'accounttypes',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
          ],
        }),
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create users executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'users', error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('users');
      this.logger.log(`Down: Drop users executed`);
    } catch (error) {
      this.logger.error(`Down: Drop users has an error: `, error?.message);
    }
  }
}
