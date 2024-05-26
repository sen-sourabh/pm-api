import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1716720974607 implements MigrationInterface {
  private readonly logger = new Logger(CreateUsers1716720974607.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
            CREATE TABLE users (
                id varchar(150) NOT NULL DEFAULT (uuid()),
                first_name varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
                last_name varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
                organization_name varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
                organization_position varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
                no_of_employees varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
                email varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                password longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                otp int DEFAULT NULL,
                secret_key varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                phone_number bigint DEFAULT NULL,
                roles_id int NOT NULL,
                user_types_id int NOT NULL,
                last_login timestamp NULL DEFAULT NULL,
                is_login tinyint NOT NULL DEFAULT '1',
                is_enabled tinyint NOT NULL DEFAULT '1',
                is_deleted tinyint NOT NULL DEFAULT '0',
                created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY organization_name (organization_name),
                UNIQUE KEY email (email),
                UNIQUE KEY secret_key (secret_key),
                UNIQUE KEY phone_number (phone_number),
                KEY roles_id (roles_id),
                KEY user_types_id (user_types_id),
                CONSTRAINT users_ibfk_1 FOREIGN KEY (roles_id) REFERENCES roles (id) ON DELETE CASCADE ON UPDATE RESTRICT,
                CONSTRAINT users_ibfk_2 FOREIGN KEY (user_types_id) REFERENCES user_types (id) ON DELETE CASCADE ON UPDATE RESTRICT
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
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
