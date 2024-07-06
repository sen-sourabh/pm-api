import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTypes1716716692286 implements MigrationInterface {
  private readonly logger = new Logger(CreateUserTypes1716716692286.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'usertypes',
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
      this.logger.log(`Up: Create usertypes executed`);
    } catch (error) {
      this.logger.error(`Up: Create usertypes has an error: `, error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('usertypes');
      this.logger.log(`Down: Drop usertypes executed`);
    } catch (error) {
      this.logger.error(`Down: Drop usertypes has an error: `, error?.message);
    }
  }
}
