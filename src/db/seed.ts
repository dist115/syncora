import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { permissionSeeder } from './seeds/permission';
import { insertUserAndAssignRole } from './seeds/user-role';
import { settingsSeeder } from './seeds/settings';
import readline from 'readline';

dotenv.config();

if (!('DATABASE_URL' in process.env))
  throw new Error('DATABASE_URL not found on .env');

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const purchaseCode = process.env.PURCHASE_CODE;
  const db = drizzle(client);
  console.log('🌱 SEEDING STARTED\n');

  try {
    console.log('🚀 Inserting permissions\n');
    await permissionSeeder(db);
    await insertUserAndAssignRole(db);
    await settingsSeeder(db);
    console.log('✅ SEEDING COMPLETED\n');
    // await makeFetchRequest(purchaseCode);
  } catch (error) {
  console.error('❌ Seeding Failed:', error instanceof Error ? error.stack : error);
  process.exit(1);
  }

  console.log('✅ System is ready !! Please wait Starting build process.....\n');
};

main().finally(() => process.exit(0));

//@ts-ignore
const makeFetchRequest = async (code) => {
  const siteUrl=process.env.SITE_URL;
  const appName="FileKit - NextJS File Sharing & Storage SAAS Platform";
  const version="1.0.0"
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const codeRegex = /^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i;
  //@ts-ignore
  if (!codeRegex.test(code)) {
    console.log('Invalid purchase code format');
    process.exit(1);
  }
  const postData = {
    k: code,
    i: 52490681,
    n: appName,
    v: version,
    u: siteUrl
}
  //@ts-ignore
  try {
    const response = await fetch('https://customer.redq.io/api/sale/verify', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
    if (!response.ok) {
      console.error('❌ Something went wrong !! Failed to verify purchase code\n');
      process.exit(1);
    }

    const responseData = await response.json();
    if (!responseData.isValid) {
      // console.log('❌ Your purchase code is invalid\n');
      // process.exit(1);
    }else{
      console.log(`✅ ${responseData.description}\n`);
    }
  } catch (error) {
    console.error('❌ Error validating license\n');
    process.exit(1);
  } finally {
    rl.close();
  }
};



