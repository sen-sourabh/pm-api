import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';

export class CreateAccountTypes1716716692286 implements MigrationInterface {
  private readonly logger = new Logger(CreateAccountTypes1716716692286.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'account_types',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '255',
              isUnique: true,
            },
            {
              name: 'isDefault',
              type: 'tinyint',
              default: 1,
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
      this.logger.log(`Up: Create account_types executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'account_types', error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('account_types');
      this.logger.log(`Down: Drop account_types executed`);
    } catch (error) {
      this.logger.error(`Down: Drop account_types has an error: `, error?.message);
    }
  }
}
