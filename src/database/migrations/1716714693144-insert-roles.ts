import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRoles1716714693144 implements MigrationInterface {
  private readonly logger = new Logger(InsertRoles1716714693144.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `INSERT INTO roles (name) VALUES ('Super Admin'), ('Admin'), ('Collaborator')`,
      );
      this.logger.log(`Up: Insert roles executed`);
    } catch (error) {
      this.logger.error(`Up: Insert roles have an error: `, error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}