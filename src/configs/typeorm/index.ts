import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();
const configService = new ConfigService();

export const DataSourcesOptions: DataSourceOptions = {
  type: configService?.getOrThrow('DATABASE_TYPE').toString(),
  host: configService?.getOrThrow('DATABASE_HOST').toString(),
  port: +configService?.getOrThrow('DATABASE_PORT').toString(),
  username: configService?.getOrThrow('DATABASE_USERNAME').toString(),
  password: configService?.getOrThrow('DATABASE_PASSWORD').toString(),
  database: configService?.getOrThrow('DATABASE_NAME').toString(),
  entities: ['dist/**/*.entity{.js}'], // corrected assignment
  migrations: ['dist/database/migrations/*.js'], // corrected assignment
  synchronize: !!configService?.getOrThrow('DATABASE_SYNCHRONIZE'),
  charset: 'utf8mb4_0900_ai_ci',
  logger: 'file',
  cache: !!configService?.getOrThrow('DATABASE_ORM_CACHE'),
};

const dataSource = new DataSource(DataSourcesOptions);
export default dataSource;
