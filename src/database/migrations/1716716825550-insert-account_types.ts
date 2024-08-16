import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertAccountTypes1716716825550 implements MigrationInterface {
  private readonly logger = new Logger(InsertAccountTypes1716716825550.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `INSERT INTO account_types (name) VALUES ('organization'), ('individual')`,
      );
      this.logger.log(`Up: Insert account_types executed`);
    } catch (error) {
      this.logger.error(`Up: Insert account_types have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
