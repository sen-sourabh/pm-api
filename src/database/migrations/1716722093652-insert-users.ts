import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUsers1716722093652 implements MigrationInterface {
  private readonly logger = new Logger(InsertUsers1716722093652.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `INSERT INTO users (first_name, organization_name, organization_position, no_of_employees, email, password, secret_key, roles_id, user_types_id) VALUES ('admin', 'Sample Org.', 'HR', 100, 'admin@yopmail.com', 'Welcome@123', 'uey!rs@2id=', 1, 1)`,
      );
      this.logger.log(`Up: Insert users executed`);
    } catch (error) {
      this.logger.error(`Up: Insert users have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
