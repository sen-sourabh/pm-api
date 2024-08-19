import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterWebhooks1724057505096 implements MigrationInterface {
  private readonly logger = new Logger(AlterWebhooks1724057505096.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE webhooks MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid webhooks executed`);
    } catch (error) {
      this.logger.error(`Up: Alter for uuid webhooks have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
