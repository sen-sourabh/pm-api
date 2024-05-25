import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();
const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: configService?.getOrThrow('DATABASE_TYPE').toString(),
  host: configService?.getOrThrow('DATABASE_HOST').toString(),
  port: +configService?.getOrThrow('DATABASE_PORT').toString(),
  username: configService?.getOrThrow('DATABASE_USERNAME').toString(),
  password: configService?.getOrThrow('DATABASE_PASSWORD').toString(),
  database: configService?.getOrThrow('DATABASE_NAME').toString(),
  entities: ['dist/**/*.entity{.js}'], // corrected assignment
  migrations: ['dist/database/migrations/*.js'], // corrected assignment
  synchronize: !!configService?.getOrThrow('DATABASE_SYNCHRONIZE').toString(),
  charset: 'utf8mb4_0900_ai_ci',
  logger: 'file',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
