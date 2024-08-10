import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterProviders1723287530322 implements MigrationInterface {
  private readonly logger = new Logger(AlterProviders1723287530322.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE providers MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid providers executed`);
    } catch (error) {
      this.logger.error(`Up: Alter for uuid providers have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
