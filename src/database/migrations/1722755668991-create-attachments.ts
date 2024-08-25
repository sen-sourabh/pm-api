import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';
import { CategoryEnum, FileFormatEnum } from '../../core/modules/files/enums';

export class CreateAttachments1722755668991 implements MigrationInterface {
  private readonly logger = new Logger(CreateAttachments1722755668991.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'attachments',
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
              length: '255',
              isNullable: false,
            },
            {
              name: 'fileFormat',
              type: 'enum',
              enum: [FileFormatEnum.Jpeg, FileFormatEnum.Jpg, FileFormatEnum.Png],
              isNullable: false,
            },
            {
              name: 'category',
              type: 'enum',
              enum: [CategoryEnum.Profile, CategoryEnum.Additional],
              isNullable: false,
            },
            {
              name: 'key',
              type: 'varchar',
              length: '255',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'url',
              type: 'mediumtext',
              isNullable: false,
            },
            {
              name: 'userId',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'vaultId',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'isArchived',
              type: 'tinyint',
              default: 0,
              isNullable: false,
            },
            {
              name: 'lastAccessed',
              type: 'datetime',
              isNullable: true,
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
              name: 'FK_attachments_users',
              columnNames: ['userId'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
            // Foreign key for vault association
            {
              name: 'FK_attachments_vaults',
              columnNames: ['vaultId'],
              referencedTableName: 'vaults',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
          ],
        }),
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create attachments executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'attachments', error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('attachments');
      this.logger.log(`Down: Drop attachments executed`);
    } catch (error) {
      this.logger.error(`Down: Drop attachments has an error: `, error?.message);
    }
  }
}
