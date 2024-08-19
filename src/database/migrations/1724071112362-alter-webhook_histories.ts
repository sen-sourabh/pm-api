import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterWebhookHistories1724071112362 implements MigrationInterface {
  private readonly logger = new Logger(AlterWebhookHistories1724071112362.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE webhook_histories MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid webhook_histories executed`);
    } catch (error) {
      this.logger.error(`Up: Alter for uuid webhook_histories have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
