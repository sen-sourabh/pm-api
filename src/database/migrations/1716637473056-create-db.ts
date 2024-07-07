import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { DataSourcesOptions } from '../../configs/typeorm';

export class CreateDb1716637473056 implements MigrationInterface {
  private readonly logger = new Logger(CreateDb1716637473056.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER DATABASE ${DataSourcesOptions?.database ?? 'vault_db'} CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`,
      );
      this.logger.log(`Up: Create database executed`);
    } catch (error) {
      this.logger.error(`Up: Create database has an error: `, error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropDatabase(`${DataSourcesOptions?.database ?? 'vault_db'}`, true);
      this.logger.log(`Down: Drop database executed`);
    } catch (error) {
      this.logger.error(`Down: Drop database has an error: `, error?.message);
    }
  }
}
