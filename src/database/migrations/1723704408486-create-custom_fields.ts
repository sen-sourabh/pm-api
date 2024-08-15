import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';
import { FieldTypeEnum } from '../../core/modules/custom-fields/enums';

export class CreateCustomFields1723704408486 implements MigrationInterface {
  private readonly logger = new Logger(CreateCustomFields1723704408486.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'custom_fields',
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
              name: 'key',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'type',
              type: 'enum',
              enum: [
                FieldTypeEnum.Boolean,
                FieldTypeEnum.Date,
                FieldTypeEnum.Email,
                FieldTypeEnum.File,
                FieldTypeEnum.Number,
                FieldTypeEnum.Password,
                FieldTypeEnum.Text,
                FieldTypeEnum.Textarea,
              ],
              isNullable: false,
            },
            {
              name: 'placeholder',
              type: 'varchar',
              length: '100',
              isNullable: true,
              default: null,
            },
            {
              name: 'helptext',
              type: 'varchar',
              length: '100',
              isNullable: true,
              default: null,
            },
            {
              name: 'example',
              type: 'varchar',
              isNullable: true,
              default: null,
            },
            {
              name: 'description',
              type: 'mediumtext',
              isNullable: true,
              default: null,
            },
            {
              name: 'addedById',
              type: 'varchar',
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
          foreignKeys: [
            // Foreign key for user association
            {
              name: 'FK_custom_fields_users',
              columnNames: ['addedById'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
          ],
        }),
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create custom_fields executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'custom_fields', error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('custom_fields');
      this.logger.log(`Down: Drop custom_fields executed`);
    } catch (error) {
      this.logger.error(`Down: Drop custom_fields has an error: `, error?.message);
    }
  }
}
