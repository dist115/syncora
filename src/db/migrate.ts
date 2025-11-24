import 'dotenv/config';

import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { db, pool } from './index';

async function main() {
  console.log('🚀    MIGRATION STARTED\n');
  await migrate(db, { migrationsFolder: 'src/db/migrations' });
  console.log('✅    MIGRATION COMPLETED\n');
  console.log('🌱    Closing DB connection...\n');
  await pool.end();
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    console.log('👋    Closing process...\n');
    process.exit(0);
  });
