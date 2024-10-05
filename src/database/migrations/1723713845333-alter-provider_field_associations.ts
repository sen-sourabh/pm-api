import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ApiErrorResponse } from '../../core/modules/activity-logs/utils/types';

export class AlterProviderFieldAssociations1723713845333 implements MigrationInterface {
  private readonly logger = new Logger(AlterProviderFieldAssociations1723713845333.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE provider_field_associations MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid provider_field_associations executed`);
    } catch (error) {
      this.logger.error(
        `Up: Alter for uuid provider_field_associations have an error: `,
        (error as ApiErrorResponse)?.message,
      );
    }
  }

  public async down(): Promise<void> {}
}
