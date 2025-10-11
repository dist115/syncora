import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { permissionSeeder } from './seeds/permission';
import { insertUserAndAssignRole } from './seeds/user-role';

dotenv.config();

if (!('DATABASE_URL' in process.env))
  throw new Error('DATABASE_URL not found on .env');

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);
  try {
    await insertUserAndAssignRole(db);
  } catch (error) {
    console.log('❌ Failed to create admin');
  }
};

main().finally(() => process.exit(0));
