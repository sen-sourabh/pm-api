import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterVaultsCollaborators1722772070782 implements MigrationInterface {
  private readonly logger = new Logger(AlterVaultsCollaborators1722772070782.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `ALTER TABLE vaults_collaborators MODIFY COLUMN id varchar(150) NOT NULL DEFAULT (uuid())`,
      );
      this.logger.log(`Up: Alter for uuid vaults_collaborators executed`);
    } catch (error) {
      this.logger.error(`Up: Alter for uuid vaults_collaborators have an error: `, error?.message);
    }
  }

  public async down(): Promise<void> {}
}
