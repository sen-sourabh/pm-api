import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCustomFields1723705099069 implements MigrationInterface {
  private readonly logger = new Logger(AlterCustomFields1723705099069.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE custom_fields MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid custom_fields executed`);
    } catch (error) {
      this.logger.error(`Up: Alter for uuid custom_fields have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
