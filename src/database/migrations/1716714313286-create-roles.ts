import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1716714313286 implements MigrationInterface {
  private readonly logger = new Logger(CreateRoles1716714313286.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
        CREATE TABLE roles (
          id int NOT NULL AUTO_INCREMENT,
          name varchar(255) NOT NULL,
          is_default tinyint NOT NULL DEFAULT '1',
          is_enabled tinyint NOT NULL DEFAULT '1',
          is_deleted tinyint NOT NULL DEFAULT '0',
          created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          UNIQUE KEY (name)
        )
      `);
      this.logger.log(`Up: Create roles executed`);
    } catch (error) {
      this.logger.error(`Up: Create roles has an error: `, error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`DROP TABLE roles`);
      this.logger.log(`Down: Drop roles executed`);
    } catch (error) {
      this.logger.error(`Down: Drop roles has an error: `, error?.message);
    }
  }
}
