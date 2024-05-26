import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUserTypes1716716825550 implements MigrationInterface {
  private readonly logger = new Logger(InsertUserTypes1716716825550.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `INSERT INTO user_types (name) VALUES ('Organization'), ('Individual')`,
      );
      this.logger.log(`Up: Insert user_types executed`);
    } catch (error) {
      this.logger.error(`Up: Insert user_types have an error: `, error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
