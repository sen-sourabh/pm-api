import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAttachments1722757312911 implements MigrationInterface {
  private readonly logger = new Logger(AlterAttachments1722757312911.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE attachments MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid attachments executed`);
    } catch (error) {
      this.logger.error(`Up: Alter for uuid attachments have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
