import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex from 'knex';

export const DATABASE = Symbol('KNEX');
export type Database = knex.Knex<any, unknown[]>;

export const databaseProvider: FactoryProvider = {
  provide: DATABASE,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) =>
    knex({
      client: 'pg',
      connection: config.get('DATABASE_URL'),
      debug: true,
    }),
};
