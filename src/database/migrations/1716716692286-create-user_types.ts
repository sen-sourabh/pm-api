import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTypes1716716692286 implements MigrationInterface {
  private readonly logger = new Logger(CreateUserTypes1716716692286.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
              CREATE TABLE user_types (
                  id varchar(150) NOT NULL DEFAULT (uuid()),
                  name varchar(255) character set utf8mb4 collate utf8mb4_0900_ai_ci NOT NULL,
                  is_default tinyint NOT NULL DEFAULT '1',
                  is_enabled tinyint NOT NULL DEFAULT '1',
                  is_deleted tinyint NOT NULL DEFAULT '0',
                  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (id),
                  UNIQUE KEY name (name)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
            `);
      this.logger.log(`Up: Create user_types executed`);
    } catch (error) {
      this.logger.error(`Up: Create user_types has an error: `, error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`DROP TABLE user_types`);
      this.logger.log(`Down: Drop user_types executed`);
    } catch (error) {
      this.logger.error(`Down: Drop user_types has an error: `, error?.message);
    }
  }
}
