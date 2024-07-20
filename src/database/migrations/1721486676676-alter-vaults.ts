import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterVaults1721486676676 implements MigrationInterface {
  private readonly logger = new Logger(AlterVaults1721486676676.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE vaults MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid vaults executed`);
    } catch (error) {
      this.logger.error(`Up: Alter for uuid vaults have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
