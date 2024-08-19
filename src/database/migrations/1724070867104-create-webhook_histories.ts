import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';

export class CreateWebhookHistories1724070867104 implements MigrationInterface {
  private readonly logger = new Logger(CreateWebhookHistories1724070867104.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'webhook_histories',
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
              name: 'webhookId',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'responseCode',
              type: 'int',
              isNullable: true,
              default: null,
            },
            {
              name: 'status',
              type: 'varchar',
              isNullable: false,
              default: 'success',
            },
            {
              name: 'nextTriggered',
              type: 'datetime',
              isNullable: true,
              default: null,
            },
            {
              name: 'payload',
              type: 'json',
              isNullable: true,
              default: null,
            },
            {
              name: 'createdAt',
              type: 'datetime',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
          ],
          foreignKeys: [
            // Foreign key for webhook association
            {
              name: 'FK_webhook_histories_webhooks',
              columnNames: ['webhookId'],
              referencedTableName: 'webhooks',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
          ],
        }),
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create webhook_histories executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'webhook_histories', error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('webhook_histories');
      this.logger.log(`Down: Drop webhook_histories executed`);
    } catch (error) {
      this.logger.error(`Down: Drop webhook_histories has an error: `, error?.message);
    }
  }
}
