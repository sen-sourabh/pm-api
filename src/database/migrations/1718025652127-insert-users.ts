import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUsers1718025652127 implements MigrationInterface {
  private readonly logger = new Logger(InsertUsers1718025652127.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `INSERT INTO users (firstName, organizationName, organizationPosition, noOfEmployees, email, password, secretKey, phoneNumber, roleId, accountTypeId) VALUES ('admin', 'Sample Org.', 'HR', 100, 'admin@yopmail.com', 'Welcome@123', 'uey!rs@2id=', 124567890, 1, 1)`,
      );
      this.logger.log(`Up: Insert users executed`);
    } catch (error) {
      this.logger.error(`Up: Insert users have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
