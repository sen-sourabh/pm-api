import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTypes1716716692286 implements MigrationInterface {
  private readonly logger = new Logger(CreateUserTypes1716716692286.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
              CREATE TABLE usertypes (
                  id int NOT NULL AUTO_INCREMENT,
                  name varchar(255) NOT NULL,
                  is_default tinyint NOT NULL DEFAULT '1',
                  is_enabled tinyint NOT NULL DEFAULT '1',
                  is_deleted tinyint NOT NULL DEFAULT '0',
                  created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                  updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                  PRIMARY KEY (id),
                  UNIQUE KEY name (name)
              )
            `);
      this.logger.log(`Up: Create usertypes executed`);
    } catch (error) {
      this.logger.error(`Up: Create usertypes has an error: `, error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`DROP TABLE usertypes`);
      this.logger.log(`Down: Drop usertypes executed`);
    } catch (error) {
      this.logger.error(`Down: Drop usertypes has an error: `, error?.message);
    }
  }
}
