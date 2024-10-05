import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();
const configService = new ConfigService();

export const DataSourcesOptions: DataSourceOptions = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  type: configService?.getOrThrow('DATABASE_TYPE').toString(),
  host: configService?.getOrThrow<string>('DATABASE_HOST').toString(),
  port: +configService?.getOrThrow<string>('DATABASE_PORT').toString(),
  username: configService?.getOrThrow<string>('DATABASE_USERNAME').toString(),
  password: configService?.getOrThrow<string>('DATABASE_PASSWORD').toString(),
  database: configService?.getOrThrow<string>('DATABASE_NAME').toString(),
  entities: ['dist/**/*.entity.js'], // corrected assignment
  migrations: ['dist/database/migrations/*.js'], // corrected assignment
  monitorCommands: true,
  synchronize: !!configService?.getOrThrow<string>('DATABASE_SYNCHRONIZE'),
  charset: 'utf8mb4_0900_ai_ci',
  logger: 'file',
  cache: !!configService?.getOrThrow<string>('DATABASE_ORM_CACHE'),
  timezone: 'Z',
  dateStrings: true,
  useUTC: true,
  logging: 'all',
};

const dataSource = new DataSource(DataSourcesOptions);
export default dataSource;
