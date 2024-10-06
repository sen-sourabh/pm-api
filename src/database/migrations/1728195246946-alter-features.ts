import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';

export class AlterFeatures1728195246946 implements MigrationInterface {
  private readonly logger = new Logger(AlterFeatures1728195246946.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE features MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid features executed`);
    } catch (error) {
      this.logger.error(
        `Up: Alter for uuid features have an error: `,
        (error as ApiErrorResponse)?.message,
      );
    }
  }

  public async down(): Promise<void> {}
}
