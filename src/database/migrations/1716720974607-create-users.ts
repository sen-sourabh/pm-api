import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1716720974607 implements MigrationInterface {
  private readonly logger = new Logger(CreateUsers1716720974607.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
            CREATE TABLE users (
                id varchar(150) NOT NULL DEFAULT (uuid()),
                firstName varchar(100) NULL,
                lastName varchar(100) NULL,
                organizationName varchar(255) NULL,
                organizationPosition varchar(150) NULL,
                noOfEmployees varchar(15) NULL,
                email varchar(150) NOT NULL,
                password longtext NOT NULL,
                otp int NULL,
                secretKey varchar(255) NOT NULL,
                phoneNumber bigint NOT NULL,
                lastLogin datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                isLogin tinyint NOT NULL DEFAULT '0',
                isEnabled tinyint NOT NULL DEFAULT '1',
                isDeleted tinyint NOT NULL DEFAULT '0',
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                role int NOT NULL,
                usertype int NOT NULL,
                roleId int NOT NULL,
                usertypeId int NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY organizationName (organizationName),
                UNIQUE KEY email (email),
                UNIQUE KEY secretKey (secretKey),
                UNIQUE KEY phoneNumber (phoneNumber),
                KEY (roleId),
                KEY (usertypeId),
                FOREIGN KEY (usertypeId) REFERENCES usertypes (id),
                FOREIGN KEY (roleId) REFERENCES roles (id)
              )
            `);
      this.logger.log(`Up: Create users executed`);
    } catch (error) {
      this.logger.error(`Up: Create users has an error: `, error?.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`DROP TABLE users`);
      this.logger.log(`Down: Drop users executed`);
    } catch (error) {
      this.logger.error(`Down: Drop users has an error: `, error?.message);
    }
  }
}
