import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';

export class CreateProviderFieldAssociations1723713302122 implements MigrationInterface {
  private readonly logger = new Logger(CreateProviderFieldAssociations1723713302122.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'provider_field_associations',
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
              name: 'providerId',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'customFieldId',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'value',
              type: 'varchar',
              isNullable: true,
              default: null,
            },
            {
              name: 'addedById',
              type: 'varchar',
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
            // Foreign key for provider association
            {
              name: 'FK_provider_field_associations_providers',
              columnNames: ['providerId'],
              referencedTableName: 'providers',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
            // Foreign key for custom_field association
            {
              name: 'FK_provider_field_associations_custom_fields',
              columnNames: ['customFieldId'],
              referencedTableName: 'custom_fields',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
            // Foreign key for user association
            {
              name: 'FK_provider_field_associations_users',
              columnNames: ['addedById'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
          ],
        }),
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create provider_field_associations executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'provider_field_associations', error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('provider_field_associations');
      this.logger.log(`Down: Drop provider_field_associations executed`);
    } catch (error) {
      this.logger.error(`Down: Drop provider_field_associations has an error: `, error?.message);
    }
  }
}
