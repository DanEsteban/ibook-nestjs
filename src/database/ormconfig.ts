import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();



export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'ibook',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true
};
