import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';

export class AlterUsers1718024754222 implements MigrationInterface {
  private readonly logger = new Logger(AlterUsers1718024754222.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE users MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid users executed`);
    } catch (error) {
      this.logger.error(
        `Up: Alter for uuid users have an error: `,
        (error as ApiErrorResponse)?.message,
      );
    }
  }

  public async down(): Promise<void> {}
}
