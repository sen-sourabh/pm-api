import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUserTypes1716716825550 implements MigrationInterface {
  private readonly logger = new Logger(InsertUserTypes1716716825550.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `INSERT INTO usertypes (name) VALUES ('organization'), ('individual')`,
      );
      this.logger.log(`Up: Insert usertypes executed`);
    } catch (error) {
      this.logger.error(`Up: Insert usertypes have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
