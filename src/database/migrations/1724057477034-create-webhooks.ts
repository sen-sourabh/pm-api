import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';
import { WebhookEventEnum } from '../../core/modules/webhooks/enums';

export class CreateWebhooks1724057477034 implements MigrationInterface {
  private readonly logger = new Logger(CreateWebhooks1724057477034.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'webhooks',
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
              isNullable: false,
            },
            {
              name: 'event',
              type: 'varchar',
              enum: [
                WebhookEventEnum.UserCreated,
                WebhookEventEnum.UserUpdated,
                WebhookEventEnum.UserDeleted,
                WebhookEventEnum.VaultCreated,
                WebhookEventEnum.VaultUpdated,
                WebhookEventEnum.VaultDeleted,
                WebhookEventEnum.CollaboratorCreated,
                WebhookEventEnum.CollaboratorUpdated,
                WebhookEventEnum.CollaboratorDeleted,
                WebhookEventEnum.ProviderCreated,
                WebhookEventEnum.ProviderUpdated,
                WebhookEventEnum.ProviderDeleted,
                WebhookEventEnum.FieldAssociationCreated,
                WebhookEventEnum.FieldAssociationUpdated,
                WebhookEventEnum.FieldAssociationDeleted,
                WebhookEventEnum.CustomFieldCreated,
                WebhookEventEnum.CustomFieldUpdated,
                WebhookEventEnum.CustomFieldDeleted,
                WebhookEventEnum.AttachmentCreated,
                WebhookEventEnum.AttachmentUpdated,
                WebhookEventEnum.AttachmentDeleted,
              ],
              isNullable: false,
            },
            {
              name: 'targetUrl',
              type: 'mediumtext',
              isNullable: false,
            },
            {
              name: 'secret',
              type: 'mediumtext',
              isNullable: false,
            },
            {
              name: 'userId',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'lastTriggered',
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
            // Foreign key for user association
            {
              name: 'FK_webhooks_users',
              columnNames: ['userId'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
          ],
        }),
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create webhooks executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'webhooks', (error as ApiErrorResponse)?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('webhooks');
      this.logger.log(`Down: Drop webhooks executed`);
    } catch (error) {
      this.logger.error(`Down: Drop webhooks has an error: `, (error as ApiErrorResponse)?.message);
    }
  }
}
