import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

config();
const configService = new ConfigService();

export const DataSourcesOptions: DataSourceOptions & SeederOptions = {
  type: configService?.getOrThrow('DATABASE_TYPE').toString(),
  host: configService?.getOrThrow('DATABASE_HOST').toString(),
  port: +configService?.getOrThrow('DATABASE_PORT').toString(),
  username: configService?.getOrThrow('DATABASE_USERNAME').toString(),
  password: configService?.getOrThrow('DATABASE_PASSWORD').toString(),
  database: configService?.getOrThrow('DATABASE_NAME').toString(),
  entities: ['dist/**/*.entity.js'], // corrected assignment
  migrations: ['dist/database/migrations/*.js'], // corrected assignment
  monitorCommands: true,
  synchronize: !!configService?.getOrThrow('DATABASE_SYNCHRONIZE'),
  charset: 'utf8mb4_0900_ai_ci',
  logger: 'file',
  cache: !!configService?.getOrThrow('DATABASE_ORM_CACHE'),
  timezone: 'Z',
  dateStrings: true,
  useUTC: true,
  logging: 'all',
};

const dataSource = new DataSource(DataSourcesOptions);
export default dataSource;
