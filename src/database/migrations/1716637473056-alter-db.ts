import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";
import { dataSourceOptions } from "../../configs/typeorm";

export class AlterDb1716637473056 implements MigrationInterface {
    private readonly logger = new Logger(AlterDb1716637473056.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
              `ALTER DATABASE ${dataSourceOptions.database ?? ''} CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`,
            );
            this.logger.log(`Up: Alter database executed`);
          } catch (error) {
            this.logger.error(`Up: Alter database has an error: `, error?.message);
          }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
    
}
