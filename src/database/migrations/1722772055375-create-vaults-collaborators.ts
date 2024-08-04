import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { printMigrationErrorLogs } from '../../core/helpers/file-operations';
import { RolesEnum } from '../../core/shared/enums';

export class CreateVaultsCollaborators1722772055375 implements MigrationInterface {
  private readonly logger = new Logger(CreateVaultsCollaborators1722772055375.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'vaults_collaborators',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
              isNullable: false,
            },
            {
              name: 'userId',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'vaultId',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'access',
              type: 'enum',
              enum: [RolesEnum.Admin, RolesEnum.Collaborator],
              isNullable: false,
            },
            {
              name: 'addedBy',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'isEnabled',
              type: 'tinyint',
              default: 1,
              isNullable: false,
            },
            {
              name: 'createdAt',
              type: 'datetime',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
            {
              name: 'updatedAt',
              type: 'datetime',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
          ],
          foreignKeys: [
            // Foreign key for user association
            {
              name: 'FK_vaults_collaborators_users',
              columnNames: ['userId'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
            // Foreign key for vault association
            {
              name: 'FK_vaults_collaborators_vaults',
              columnNames: ['vaultId'],
              referencedTableName: 'vaults',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
            // Foreign key for addedBy association
            {
              name: 'FK_vaults_collaborators_addedby',
              columnNames: ['addedBy'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE', // Optional: Set deletion behavior (e.g., CASCADE, SET NULL)
            },
          ],
        }),
        false, // Skip table type check as it can vary across databases
      );
      this.logger.log(`Up: Create vaults_collaborators executed`);
    } catch (error) {
      printMigrationErrorLogs(this.logger, 'vaults_collaborators', error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropTable('vaults_collaborators');
      this.logger.log(`Down: Drop vaults_collaborators executed`);
    } catch (error) {
      this.logger.error(`Down: Drop vaults_collaborators has an error: `, error?.message);
    }
  }
}
