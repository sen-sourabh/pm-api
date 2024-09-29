import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPlans1727611597636 implements MigrationInterface {
  private readonly logger = new Logger(AlterPlans1727611597636.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE plans MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid plans executed`);
    } catch (error) {
      this.logger.error(`Up: Alter for uuid plans have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
